import InsightCard from "./InsightCard";
import Icon from "../common/Icon";

import { formatCurrency } from "../../utils/formatCurrency";

export default function InsightsGrid({ aiInsights }) {
  const insights = aiInsights || {};
  return (
    <div>
      <div className="mb-5">
        <h2 className="font-semibold text-lg text-ink tracking-tight">AI Insights</h2>
        <p className="text-sm text-muted mt-1">
          Generated from your transaction history
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <InsightCard icon="lightbulb" tone="accent" title="Spending Summary">
          <p>{insights.summary}</p>
        </InsightCard>

        <InsightCard icon="check" tone="positive" title="Top 3 Saving Suggestions">
          <ul className="space-y-2.5">
            {(insights.savingSuggestions || []).map((suggestion) => (
              <li key={suggestion} className="flex items-start gap-2.5">
                <Icon name="check" className="w-4 h-4 text-positive mt-0.5 shrink-0" />
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </InsightCard>

        <InsightCard
    icon="alert"
    tone="warn"
    title="Unusual Transactions"
>
    <ul className="space-y-2">
        {(insights.unusualTransactions || []).map((transaction, index) => (
            <li
                key={index}
                className="rounded-xl bg-warn-light/60 px-3.5 py-2.5"
            >
                {transaction}
            </li>
        ))}
    </ul>
</InsightCard>

        <InsightCard icon="target" tone="accent" title="Budget Recommendation">
          <p>{insights.budgetRecommendation}</p>
        </InsightCard>
      </div>
    </div>
  );
}
