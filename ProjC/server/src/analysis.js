/**
 * Deterministic analysis over already-categorized transactions.
 * No AI calls here — subscription detection and next-month projection
 * are pattern-matching problems, not generation problems, so we keep them
 * fast, free, and reproducible.
 */

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function daysBetween(a, b) {
  return Math.abs((new Date(a) - new Date(b)) / MS_PER_DAY);
}

function median(nums) {
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

function mean(nums) {
  return nums.reduce((s, n) => s + n, 0) / nums.length;
}

// Known cadences we try to match recurring charges against, in days,
// with how much wiggle room we allow around that interval.
const CADENCES = [
  { label: "weekly", days: 7, tolerance: 2 },
  { label: "biweekly", days: 14, tolerance: 3 },
  { label: "monthly", days: 30, tolerance: 4 },
  { label: "quarterly", days: 91, tolerance: 7 },
  { label: "yearly", days: 365, tolerance: 10 },
];

function matchCadence(avgGapDays) {
  for (const c of CADENCES) {
    if (Math.abs(avgGapDays - c.days) <= c.tolerance) return c;
  }
  return null;
}

// Categories where recurring-and-similar-amount is actually meaningful as a
// "subscription" signal. A monthly grocery run can look statistically
// identical to a subscription (regular cadence, similar total) without
// being one — restricting by category avoids that false positive.
const SUBSCRIPTION_LIKE_CATEGORIES = new Set([
  "Subscriptions",
  "Entertainment",
  "Insurance",
  "Loan & EMI",
  "Utilities",
  "Rent & Housing",
  "Education",
  "Healthcare",
  "Other Expense",
]);

/**
 * Groups expense transactions by counterparty and flags groups that look
 * like recurring subscriptions: 2+ occurrences, fairly regular spacing,
 * and fairly consistent amounts.
 */
export function detectSubscriptions(transactions) {
  const expenseTx = transactions.filter(
    (t) => t.type === "expense" && SUBSCRIPTION_LIKE_CATEGORIES.has(t.category)
  );

  const byCounterparty = new Map();
  for (const t of expenseTx) {
    const key = t.counterparty?.trim().toLowerCase() || "unknown";
    if (!byCounterparty.has(key)) byCounterparty.set(key, []);
    byCounterparty.get(key).push(t);
  }

  const subscriptions = [];

  for (const [, group] of byCounterparty) {
    if (group.length < 2) continue;

    const sorted = [...group].sort((a, b) => new Date(a.date) - new Date(b.date));
    const amounts = sorted.map((t) => t.amount);
    const avgAmount = mean(amounts);

    // Subscription billing is consistent to the cent (or very close to it).
    // A real recurring service charge rarely drifts more than ~3%; bigger
    // swings usually mean variable usage (e.g. groceries, utilities that
    // bill by consumption) rather than a fixed subscription.
    const amountVariance =
      amounts.reduce((s, a) => s + Math.abs(a - avgAmount), 0) / amounts.length;
    const amountVariancePct = avgAmount > 0 ? amountVariance / avgAmount : 1;
    if (amountVariancePct > 0.05) continue;

    // Gap consistency.
    const gaps = [];
    for (let i = 1; i < sorted.length; i++) {
      gaps.push(daysBetween(sorted[i].date, sorted[i - 1].date));
    }
    const avgGap = mean(gaps);
    const cadence = matchCadence(avgGap);
    if (!cadence) continue;

    const lastTx = sorted[sorted.length - 1];
    const nextExpectedDate = new Date(
      new Date(lastTx.date).getTime() + cadence.days * MS_PER_DAY
    )
      .toISOString()
      .slice(0, 10);

    subscriptions.push({
      counterparty: lastTx.counterparty,
      category: lastTx.category,
      cadence: cadence.label,
      averageAmount: Math.round(median(amounts) * 100) / 100,
      occurrences: sorted.length,
      lastChargeDate: lastTx.date,
      nextExpectedDate,
      annualCost:
        Math.round(median(amounts) * (365 / cadence.days) * 100) / 100,
    });
  }

  return subscriptions.sort((a, b) => b.annualCost - a.annualCost);
}

/**
 * Projects next month's expected charges: known subscriptions due to renew,
 * plus an estimate of typical non-subscription spend based on the average
 * of past months in the statement (when more than one month of data exists;
 * otherwise falls back to scaling the single month).
 */
export function predictNextMonth(transactions, subscriptions) {
  const expenseTx = transactions.filter((t) => t.type === "expense");

  if (expenseTx.length === 0) {
    return {
      estimatedSubscriptionCharges: 0,
      estimatedOtherSpend: 0,
      estimatedTotal: 0,
      upcomingSubscriptionCharges: [],
    };
  }

  const subscriptionAnnual = subscriptions.reduce(
    (s, sub) => s + sub.annualCost,
    0
  );
  const estimatedSubscriptionCharges = Math.round((subscriptionAnnual / 12) * 100) / 100;

  // Group non-subscription expenses by month to get a typical monthly run-rate.
  const subCounterparties = new Set(
    subscriptions.map((s) => s.counterparty.toLowerCase())
  );
  const nonSubExpenses = expenseTx.filter(
    (t) => !subCounterparties.has(t.counterparty?.trim().toLowerCase())
  );

  const byMonth = new Map();
  for (const t of nonSubExpenses) {
    const monthKey = t.date.slice(0, 7); // YYYY-MM
    byMonth.set(monthKey, (byMonth.get(monthKey) || 0) + t.amount);
  }
  const monthlyTotals = Array.from(byMonth.values());
  const estimatedOtherSpend =
    monthlyTotals.length > 0
      ? Math.round(mean(monthlyTotals) * 100) / 100
      : 0;

  const upcomingSubscriptionCharges = subscriptions
    .filter((s) => s.nextExpectedDate)
    .sort((a, b) => new Date(a.nextExpectedDate) - new Date(b.nextExpectedDate));

  return {
    estimatedSubscriptionCharges,
    estimatedOtherSpend,
    estimatedTotal:
      Math.round((estimatedSubscriptionCharges + estimatedOtherSpend) * 100) / 100,
    upcomingSubscriptionCharges,
  };
}

/**
 * Category and monthly breakdowns, for charting.
 */
export function buildSpendingBreakdown(transactions) {
  const expenseTx = transactions.filter((t) => t.type === "expense");

  const byCategory = new Map();
  for (const t of expenseTx) {
    byCategory.set(t.category, (byCategory.get(t.category) || 0) + t.amount);
  }
  const categoryBreakdown = Array.from(byCategory.entries())
    .map(([category, total]) => ({
      category,
      total: Math.round(total * 100) / 100,
    }))
    .sort((a, b) => b.total - a.total);

  const byMonth = new Map();
  for (const t of transactions) {
    const monthKey = t.date.slice(0, 7);
    if (!byMonth.has(monthKey)) {
      byMonth.set(monthKey, { month: monthKey, income: 0, expense: 0 });
    }
    const entry = byMonth.get(monthKey);
    if (t.type === "income") entry.income += t.amount;
    else entry.expense += t.amount;
  }
  const monthlyBreakdown = Array.from(byMonth.values())
    .map((m) => ({
      month: m.month,
      income: Math.round(m.income * 100) / 100,
      expense: Math.round(m.expense * 100) / 100,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));

  return { categoryBreakdown, monthlyBreakdown };
}
