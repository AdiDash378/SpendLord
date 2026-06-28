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

app.use(cors());
app.use(express.json());

// Keep the PDF in memory only — we never need to persist it to disk.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB, matches Gemini's inline data limit
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
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded. Field name must be 'statement'." });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({
      error: "Server is missing GEMINI_API_KEY. Add it to server/.env and restart the server.",
    });
  }

  try {
    const data = await extractStatementData(req.file.buffer);

    // Deterministic analysis runs locally — fast, free, no extra AI call.
    const subscriptions = detectSubscriptions(data.transactions);
    const nextMonth = predictNextMonth(data.transactions, subscriptions);
    const { categoryBreakdown, monthlyBreakdown } = buildSpendingBreakdown(
      data.transactions
    );

    // Cost-cutting suggestions are the one place an LLM call earns its keep —
    // it works off the compact summary below, not the raw PDF, so it's cheap.
    let suggestions = [];
    try {
      suggestions = await getCostCuttingSuggestions({
        summary: data.summary,
        categoryBreakdown,
        subscriptions,
      });
    } catch (err) {
      // Suggestions are a nice-to-have. If this one call fails, don't fail
      // the whole response — just ship an empty list.
      console.error("Cost-cutting suggestions failed:", err.message);
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

// Multer-specific errors (file too large, wrong type) land here.
app.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError || err.message?.includes("PDF")) {
    return res.status(400).json({ error: err.message });
  }
  console.error(err);
  res.status(500).json({ error: "Unexpected server error." });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
