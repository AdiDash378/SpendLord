import Card from "../common/Card";
import Icon from "../common/Icon";

export default function FeatureCard({ icon, title, description }) {
  return (
    <Card className="p-6 group">
      <div className="w-10 h-10 rounded-xl bg-accent-light text-accent flex items-center justify-center mb-5 group-hover:bg-accent group-hover:text-white transition-colors duration-300">
        <Icon name={icon} className="w-5 h-5" />
      </div>
      <h3 className="font-semibold text-ink tracking-tight">{title}</h3>
      <p className="mt-2 text-sm text-muted leading-relaxed">{description}</p>
    </Card>
  );
}
