import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import { extractStatementData } from "./geminiService.js";
import {
  detectSubscriptions,
  predictNextMonth,
  buildSpendingBreakdown,
} from "./analysis.js";
import { getCostCuttingSuggestions } from "./insightsService.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are supported."));
    }
    cb(null, true);
  },
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/parse-statement", upload.single("statement"), async (req, res) => {
  // Give this route 5 minutes — Gemini can be slow on large statements
  req.setTimeout(300_000);
  res.setTimeout(300_000);

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded. Field name must be 'statement'." });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({
      error: "Server is missing GEMINI_API_KEY. Add it to server/.env and restart.",
    });
  }

  try {
    const data = await extractStatementData(req.file.buffer);

    const subscriptions = detectSubscriptions(data.transactions);
    const nextMonth = predictNextMonth(data.transactions, subscriptions);
    const { categoryBreakdown, monthlyBreakdown } = buildSpendingBreakdown(data.transactions);

    let suggestions = [];
    try {
      suggestions = await getCostCuttingSuggestions({
        summary: data.summary,
        categoryBreakdown,
        subscriptions,
      });
    } catch (err) {
      console.error("Cost-cutting suggestions failed (non-fatal):", err.message);
    }

    res.json({
      ...data,
      insights: {
        subscriptions,
        nextMonth,
        categoryBreakdown,
        monthlyBreakdown,
        suggestions,
      },
    });
  } catch (err) {
    console.error("Failed to parse statement:", err);
    res.status(502).json({
      error: "Failed to parse the statement with Gemini.",
      details: err.message,
    });
  }
});

// Multer-specific errors (file too large, wrong type)
app.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError || err.message?.includes("PDF")) {
    return res.status(400).json({ error: err.message });
  }
  console.error(err);
  res.status(500).json({ error: "Unexpected server error." });
});

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Keep-alive timeout must exceed the longest expected request (5 min)
server.keepAliveTimeout = 310_000;
server.headersTimeout = 320_000;
