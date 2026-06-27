import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import Card from "../common/Card";
import { monthlySpending } from "../../utils/mockData";
import { formatCurrency } from "../../utils/formatCurrency";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-ink text-white text-xs font-medium px-3 py-2 rounded-lg shadow-card-hover">
      {label}: {formatCurrency(payload[0].value)}
    </div>
  );
}

export default function BarChartCard() {
  const maxIndex = monthlySpending.reduce(
    (maxIdx, item, idx, arr) => (item.amount > arr[maxIdx].amount ? idx : maxIdx),
    0
  );

  return (
    <Card className="p-6">
      <h3 className="font-semibold text-ink tracking-tight mb-1">Monthly Spending</h3>
      <p className="text-sm text-muted mb-4">Jan through Jun</p>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlySpending} margin={{ top: 8, right: 4, left: -16, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#E7E5E2" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#6B7280", fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#6B7280", fontSize: 12 }}
              tickFormatter={(value) => `₹${value / 1000}k`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#EEEEFD" }} />
            <Bar dataKey="amount" radius={[8, 8, 8, 8]} maxBarSize={36}>
              {monthlySpending.map((entry, index) => (
                <Cell
                  key={entry.month}
                  fill={index === maxIndex ? "#5B5FEF" : "#C7C9F8"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
