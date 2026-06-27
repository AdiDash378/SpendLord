import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import Card from "../common/Card";

import { formatCurrency } from "../../utils/formatCurrency";

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="bg-ink text-white text-xs font-medium px-3 py-2 rounded-lg shadow-card-hover">
      {item.name}: {formatCurrency(item.value)}
    </div>
  );
}

export default function PieChartCard({ categoryData }) {
  const COLORS = [
  "#2563eb",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
];

const chartData = categoryData.map((item, index) => ({
  name: item.category,
  value: item.amount,
  color: COLORS[index % COLORS.length],
}));
  return (
    <Card className="p-6">
      <h3 className="font-semibold text-ink tracking-tight mb-1">Expense Distribution</h3>
      <p className="text-sm text-muted mb-4">By category, this month</p>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={62}
              outerRadius={92}
              paddingAngle={2}
              stroke="none"
            >
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span className="text-xs text-ink-soft">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
