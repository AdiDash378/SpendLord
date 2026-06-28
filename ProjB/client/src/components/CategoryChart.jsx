import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { formatCurrency } from "./SummaryStrip";

const BAR_COLOR = "#10172A";

function CustomTooltip({ active, payload, currency }) {
  if (!active || !payload?.length) return null;
  const { category, total } = payload[0].payload;
  return (
    <div className="chart-tooltip">
      <strong>{category}</strong>
      <span>{formatCurrency(total, currency)}</span>
    </div>
  );
}

export default function CategoryChart({ data, currency }) {
  if (!data.length) return null;

  // Recharts needs a fixed-ish height; scale gently with row count so it
  // doesn't look cramped with few categories or huge with many.
  const height = Math.max(220, data.length * 38);

  return (
    <div className="chart-card">
      <h3 className="chart-card__title">Spending by category</h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 24, bottom: 4, left: 12 }}
        >
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="category"
            width={150}
            tick={{ fontSize: 12, fill: "var(--ink-soft)", fontFamily: "var(--font-body)" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip currency={currency} />} cursor={{ fill: "rgba(16,23,42,0.04)" }} />
          <Bar dataKey="total" radius={[0, 3, 3, 0]} barSize={16}>
            {data.map((_, i) => (
              <Cell key={i} fill={BAR_COLOR} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
