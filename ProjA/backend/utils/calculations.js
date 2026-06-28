/**
 * Calculates all financial statistics from parsed transaction rows.
 * @param {Array} transactions - Array of row objects from CSV
 * @returns {Object} Financial summary
 */
const calculateStatistics = (transactions) => {
  const income = transactions.filter((t) => t.Type === "Income");
  const expenses = transactions.filter((t) => t.Type === "Expense");

  const totalIncome = sumAmounts(income);
  const totalExpenses = sumAmounts(expenses);
  const savings = totalIncome - totalExpenses;

  const categoryData = buildCategoryBreakdown(expenses);
  const highestCategory = getHighestCategory(categoryData);
  const monthlyData = buildMonthlyBreakdown(transactions);
  const largestExpense = getLargestExpense(expenses);

  return {
    totalIncome,
    totalExpenses,
    savings,
    highestCategory,
    largestExpense,
    totalTransactions: transactions.length,
    categoryData,
    monthlyData,
  };
};

const sumAmounts = (rows) =>
  rows.reduce((sum, row) => sum + parseFloat(row.Amount || 0), 0);

const buildCategoryBreakdown = (expenses) => {
  const map = expenses.reduce((acc, t) => {
    const category = t.Category || "Uncategorized";
    acc[category] = (acc[category] || 0) + parseFloat(t.Amount || 0);
    return acc;
  }, {});

  return Object.entries(map).map(([category, amount]) => ({ category, amount }));
};

const getHighestCategory = (categoryData) => {
  if (!categoryData.length) return null;
  return categoryData.reduce((max, item) =>
    item.amount > max.amount ? item : max
  ).category;
};

const buildMonthlyBreakdown = (transactions) => {
  const map = transactions.reduce((acc, t) => {
    const month = getMonthKey(t.Date);
    if (!acc[month]) acc[month] = { income: 0, expense: 0 };
    const amount = parseFloat(t.Amount || 0);
    if (t.Type === "Income") acc[month].income += amount;
    else acc[month].expense += amount;
    return acc;
  }, {});

  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, values]) => ({ month, ...values }));
};

const getMonthKey = (dateStr) => {
  try {
    const d = new Date(dateStr);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  } catch {
    return "Unknown";
  }
};

const getLargestExpense = (expenses) => {
  if (!expenses.length) return null;
  const largest = expenses.reduce((max, t) =>
    parseFloat(t.Amount) > parseFloat(max.Amount) ? t : max
  );
  return {
    description: largest.Description,
    amount: parseFloat(largest.Amount),
    category: largest.Category,
    date: largest.Date,
  };
};

module.exports = { calculateStatistics };
