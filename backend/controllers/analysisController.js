const { parseCSV, cleanupFile } = require("../services/csvService");
const { calculateStatistics } = require("../utils/calculations");
const { getAIInsights } = require("../services/geminiService");

const analyzeExpenses = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded. Please upload a CSV file." });
  }

  const filePath = req.file.path;

  try {
    // Step 1: Parse CSV
    const transactions = await parseCSV(filePath);

    if (!transactions.length) {
      return res.status(400).json({ error: "The uploaded CSV file is empty or has no valid rows." });
    }

    // Step 2: Calculate statistics
    const statistics = calculateStatistics(transactions);

    // Step 3: Get AI insights from Gemini
    const aiInsights = await getAIInsights(statistics);

    // Step 4: Return combined response
    return res.status(200).json({
      statistics: {
        totalIncome: statistics.totalIncome,
        totalExpenses: statistics.totalExpenses,
        savings: statistics.savings,
        highestCategory: statistics.highestCategory,
        largestExpense: statistics.largestExpense,
        totalTransactions: statistics.totalTransactions,
      },
      charts: {
        categoryData: statistics.categoryData,
        monthlyData: statistics.monthlyData,
      },
      aiInsights,
    });
  } catch (err) {
    console.error("Analysis error:", err.message);

    if (err.message.startsWith("CSV parsing failed")) {
      return res.status(500).json({ error: "CSV parsing failed.", details: err.message });
    }

    if (err.message.includes("Gemini")) {
      return res.status(500).json({ error: "Gemini API failed.", details: err.message });
    }

    return res.status(500).json({ error: "Analysis failed.", details: err.message });
  } finally {
    // Always clean up the uploaded file
    cleanupFile(filePath);
  }
};

module.exports = { analyzeExpenses };
