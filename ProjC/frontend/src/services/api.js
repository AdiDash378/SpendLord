import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
  // No global timeout — the upload + Gemini call can take 60-90s
});

/**
 * Sends a PDF bank statement to the backend and returns
 * data shaped for the frontend's dashboard components.
 */
export async function uploadExpenseFile(file) {
  const formData = new FormData();
  formData.append("statement", file);

  // IMPORTANT: Do NOT set Content-Type manually.
  // Axios + browser sets it automatically with the correct multipart boundary.
  // Setting it manually strips the boundary and breaks the upload.
  const response = await api.post("/parse-statement", formData, {
    timeout: 180000, // 3 minutes per-request override
  });

  return adaptBackendResponse(response.data);
}

/**
 * Adapts the backend's response shape to what the frontend components expect.
 *
 * Backend returns:
 *   { summary, transactions, insights: { categoryBreakdown, monthlyBreakdown,
 *     subscriptions, nextMonth, suggestions }, accountHolder, bankName, ... }
 *
 * Frontend expects:
 *   { statistics: { totalIncome, totalExpenses, savings, highestCategory },
 *     charts: { categoryData: [{ category, amount }], monthlyData },
 *     aiInsights: { summary, savingSuggestions, unusualTransactions, budgetRecommendation } }
 */
function adaptBackendResponse(data) {
  const { summary, insights = {} } = data;
  const {
    categoryBreakdown = [],
    monthlyBreakdown = [],
    subscriptions = [],
    nextMonth = {},
    suggestions = [],
  } = insights;

  // ── statistics ──────────────────────────────────────────────────────────────
  const highestCategory =
    categoryBreakdown.length > 0 ? categoryBreakdown[0].category : "—";

  const statistics = {
    totalIncome: summary?.totalIncome ?? 0,
    totalExpenses: summary?.totalExpense ?? 0,
    savings: (summary?.totalIncome ?? 0) - (summary?.totalExpense ?? 0),
    highestCategory,
  };

  // ── charts ───────────────────────────────────────────────────────────────────
  const categoryData = categoryBreakdown.map((c) => ({
    category: c.category,
    amount: c.total,
  }));

  const charts = {
    categoryData,
    monthlyData: monthlyBreakdown, // already { month, income, expense }
  };

  // ── aiInsights ───────────────────────────────────────────────────────────────
  const topCats = categoryBreakdown
    .slice(0, 3)
    .map((c) => c.category)
    .join(", ");

  const aiSummaryText =
    topCats.length > 0
      ? `Your biggest spending categories are ${topCats}. ` +
        `Total income: ₹${(summary?.totalIncome ?? 0).toLocaleString("en-IN")}, ` +
        `total expenses: ₹${(summary?.totalExpense ?? 0).toLocaleString("en-IN")}.`
      : "No categorised transactions found.";

  const savingSuggestions = suggestions
    .slice(0, 3)
    .map((s) => `${s.title}: ${s.detail}`);

  const unusualTransactions = subscriptions
    .filter((s) => s.annualCost > 1000)
    .slice(0, 3)
    .map(
      (s) =>
        `${s.counterparty} — ₹${s.averageAmount} ${s.cadence} (≈ ₹${s.annualCost}/yr)`
    );

  const budgetRecommendation =
    nextMonth?.estimatedTotal != null
      ? `Based on your spending patterns, your estimated outflow next month is ` +
        `₹${(nextMonth.estimatedTotal ?? 0).toLocaleString("en-IN")} ` +
        `(₹${(nextMonth.estimatedSubscriptionCharges ?? 0).toLocaleString("en-IN")} subscriptions + ` +
        `₹${(nextMonth.estimatedOtherSpend ?? 0).toLocaleString("en-IN")} other).`
      : "Not enough data for a projection.";

  return {
    statistics,
    charts,
    aiInsights: {
      summary: aiSummaryText,
      savingSuggestions,
      unusualTransactions,
      budgetRecommendation,
    },
  };
}

export default api;
