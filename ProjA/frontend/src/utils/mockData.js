export const summaryStats = {
  totalIncome: 75000,
  totalExpenses: 52000,
  savings: 23000,
  highestCategory: "Food",
};

export const categoryDistribution = [
  { name: "Food", value: 18500, color: "#5B5FEF" },
  { name: "Transport", value: 8200, color: "#8B8EF5" },
  { name: "Shopping", value: 12300, color: "#0F9D58" },
  { name: "Bills", value: 9400, color: "#E8590C" },
  { name: "Entertainment", value: 3600, color: "#F2A65A" },
];

export const monthlySpending = [
  { month: "Jan", amount: 41200 },
  { month: "Feb", amount: 38900 },
  { month: "Mar", amount: 45600 },
  { month: "Apr", amount: 49800 },
  { month: "May", amount: 47300 },
  { month: "Jun", amount: 52000 },
];

export const spendingSummary = {
  title: "Spending Summary",
  description:
    "You spend most of your money on Food and Shopping. Together, these two categories make up nearly 60% of your monthly expenses.",
};

export const savingSuggestions = [
  "Reduce food delivery orders to 2-3 times a week",
  "Lower entertainment spending by setting a monthly cap",
  "Track recurring subscriptions and cancel unused ones",
];

export const unusualTransactions = [
  {
    id: 1,
    amount: 4500,
    label: "Electronics",
    note: "40% above your usual category spend",
  },
  {
    id: 2,
    amount: 2700,
    label: "Late-night food order",
    note: "Placed after midnight, 3 days this week",
  },
  {
    id: 3,
    amount: 1850,
    label: "Subscription renewal",
    note: "Unused app, renewed automatically",
  },
];

export const budgetRecommendation = {
  title: "Budget Recommendation",
  description:
    "Maintain monthly spending under ₹50,000 to reach your savings goal of ₹30,000 by year end.",
};

export const featureList = [
  {
    icon: "sparkles",
    title: "AI Expense Analysis",
    description:
      "Automatically categorize and analyze every transaction the moment you upload your statement.",
  },
  {
    icon: "lightbulb",
    title: "Smart Insights",
    description:
      "Get plain-language explanations of where your money goes and why it matters.",
  },
  {
    icon: "chart",
    title: "Visual Charts",
    description:
      "See your spending broken down into clear, interactive pie and bar charts.",
  },
  {
    icon: "target",
    title: "Budget Recommendations",
    description:
      "Receive a personalized monthly budget designed to hit your savings goals.",
  },
];

export const heroTicker = [
  { label: "Swiggy · Food delivery", amount: 480, category: "Food" },
  { label: "Uber · Ride", amount: 220, category: "Transport" },
  { label: "Amazon · Order", amount: 1340, category: "Shopping" },
  { label: "Electricity Bill", amount: 1850, category: "Bills" },
  { label: "Netflix · Subscription", amount: 199, category: "Entertainment" },
];
