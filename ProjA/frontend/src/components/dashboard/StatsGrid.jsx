import StatCard from "./StatCard";

import { formatCurrency } from "../../utils/formatCurrency";

export default function StatsGrid({ statistics }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Income"
        value={formatCurrency(statistics.totalIncome)}
        icon="trendUp"
        tone="positive"
      />
      <StatCard
        label="Total Expenses"
        value={formatCurrency(statistics.totalExpenses)}
        icon="wallet"
        tone="warn"
      />
      <StatCard
        label="Savings"
        value={formatCurrency(statistics.savings)}
        icon="piggy"
        tone="accent"
      />
      <StatCard
        label="Highest Category"
        value={statistics.highestCategory}
        icon="chart"
        tone="neutral"
      />
    </div>
  );
}
