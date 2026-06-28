import Card from "../common/Card";
import Icon from "../common/Icon";

export default function InsightCard({ icon, tone = "accent", title, children }) {
  const toneStyles = {
    accent: "bg-accent-light text-accent",
    positive: "bg-positive-light text-positive",
    warn: "bg-warn-light text-warn",
  };

  return (
    <Card className="p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <span
          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${toneStyles[tone]}`}
        >
          <Icon name={icon} className="w-5 h-5" />
        </span>
        <h3 className="font-semibold text-ink tracking-tight">{title}</h3>
      </div>
      <div className="text-sm text-ink-soft leading-relaxed flex-1">{children}</div>
    </Card>
  );
}
