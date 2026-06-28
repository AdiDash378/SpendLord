import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { formatCurrency } from "./SummaryStrip";

function CustomTooltip({ active, payload, label, currency }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <strong>{label}</strong>
      {payload.map((p) => (
        <span key={p.dataKey} style={{ color: p.color }}>
          {p.dataKey === "income" ? "In: " : "Out: "}
          {formatCurrency(p.value, currency)}
        </span>
      ))}
    </div>
  );
}

export default function MonthlyTrendChart({ data, currency }) {
  if (data.length < 2) return null; // a trend needs more than one point

  return (
    <div className="chart-card">
      <h3 className="chart-card__title">Income vs. expense by month</h3>
      <ResponsiveContainer width="100%" height={240}>
        <ComposedChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--rule)" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: "var(--ink-soft)", fontFamily: "var(--font-mono)" }}
            axisLine={{ stroke: "var(--rule)" }}
            tickLine={false}
          />
          <YAxis hide />
          <Tooltip content={<CustomTooltip currency={currency} />} cursor={{ fill: "rgba(16,23,42,0.04)" }} />
          <Bar dataKey="expense" fill="#B54834" radius={[3, 3, 0, 0]} barSize={22} />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#1B8A5A"
            strokeWidth={2}
            dot={{ r: 3, fill: "#1B8A5A" }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
