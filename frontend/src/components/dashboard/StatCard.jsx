import Card from "../common/Card";
import Icon from "../common/Icon";

const toneStyles = {
  accent: "bg-accent-light text-accent",
  positive: "bg-positive-light text-positive",
  warn: "bg-warn-light text-warn",
  neutral: "bg-ink/5 text-ink-soft",
};

export default function StatCard({ label, value, icon, tone = "accent" }) {
  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-muted">{label}</span>
        <span
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${toneStyles[tone]}`}
        >
          <Icon name={icon} className="w-4 h-4" />
        </span>
      </div>
      <p className="text-2xl font-bold tracking-tight text-ink tabular">{value}</p>
    </Card>
  );
}
