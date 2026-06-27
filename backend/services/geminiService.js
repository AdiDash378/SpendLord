const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Sends the financial summary to Gemini and returns structured AI insights.
 * @param {Object} statistics - Calculated financial stats
 * @returns {Promise<Object>} AI insights as JSON
 */
const getAIInsights = async (statistics) => {
  const prompt = buildPrompt(statistics);

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
  });

  const rawText = response.text.trim();
  return parseGeminiResponse(rawText);
};

const buildPrompt = (stats) => `
You are a personal finance advisor. Analyze the following expense data and return ONLY a valid JSON object — no markdown, no explanation, no backticks.

Financial Summary:
- Total Income: ₹${stats.totalIncome}
- Total Expenses: ₹${stats.totalExpenses}
- Savings: ₹${stats.savings}
- Highest Spending Category: ${stats.highestCategory}
- Total Transactions: ${stats.totalTransactions}
- Largest Expense: ${stats.largestExpense ? `₹${stats.largestExpense.amount} on ${stats.largestExpense.description} (${stats.largestExpense.category})` : "N/A"}

Category Breakdown:
${stats.categoryData.map((c) => `- ${c.category}: ₹${c.amount}`).join("\n")}

Monthly Breakdown:
${stats.monthlyData.map((m) => `- ${m.month}: Income ₹${m.income}, Expense ₹${m.expense}`).join("\n")}

Return ONLY this JSON structure with no other text:
{
  "summary": "A 2-3 sentence overview of the financial health",
  "savingSuggestions": [
    "Specific actionable suggestion 1",
    "Specific actionable suggestion 2",
    "Specific actionable suggestion 3"
  ],
  "unusualTransactions": [
    "Description of any unusual or high spending pattern 1",
    "Description of any unusual or high spending pattern 2"
  ],
  "budgetRecommendation": "A single concrete monthly budget recommendation"
}
`.trim();

const parseGeminiResponse = (rawText) => {
  try {
    // Strip markdown code fences if Gemini returns them despite instructions
    const cleaned = rawText.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
    return JSON.parse(cleaned);
  } catch {
    throw new Error("Gemini returned invalid JSON. Raw response: " + rawText.slice(0, 200));
  }
};

module.exports = { getAIInsights };
