import { Lightbulb } from "lucide-react";
import { formatCurrency } from "./SummaryStrip";

export default function SuggestionsCard({ suggestions, currency }) {
  if (suggestions.length === 0) {
    return (
      <div className="card card--wide">
        <h3 className="card__title">
          <Lightbulb size={16} strokeWidth={1.75} />
          Ways to cut costs
        </h3>
        <p className="card__empty">
          Nothing stood out as worth cutting — spending looks reasonably lean
          across categories.
        </p>
      </div>
    );
  }

  return (
    <div className="card card--wide">
      <h3 className="card__title">
        <Lightbulb size={16} strokeWidth={1.75} />
        Ways to cut costs
      </h3>
      <ul className="suggestion-list">
        {suggestions.map((s, i) => (
          <li key={i} className="suggestion-list__item">
            <div className="suggestion-list__text">
              <span className="suggestion-list__title">{s.title}</span>
              <span className="suggestion-list__detail">{s.detail}</span>
            </div>
            {s.estimatedMonthlySavings > 0 && (
              <span className="suggestion-list__savings">
                save ~{formatCurrency(s.estimatedMonthlySavings, currency)}/mo
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
