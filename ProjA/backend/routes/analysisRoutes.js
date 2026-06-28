const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { analyzeExpenses } = require("../controllers/analysisController");

// POST /api/analyze
router.post("/analyze", upload.single("file"), analyzeExpenses);

module.exports = router;
