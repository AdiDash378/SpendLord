import StatCard from "./StatCard";
import { summaryStats } from "../../utils/mockData";
import { formatCurrency } from "../../utils/formatCurrency";

export default function StatsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Income"
        value={formatCurrency(summaryStats.totalIncome)}
        icon="trendUp"
        tone="positive"
      />
      <StatCard
        label="Total Expenses"
        value={formatCurrency(summaryStats.totalExpenses)}
        icon="wallet"
        tone="warn"
      />
      <StatCard
        label="Savings"
        value={formatCurrency(summaryStats.savings)}
        icon="piggy"
        tone="accent"
      />
      <StatCard
        label="Highest Category"
        value={summaryStats.highestCategory}
        icon="chart"
        tone="neutral"
      />
    </div>
  );
}
