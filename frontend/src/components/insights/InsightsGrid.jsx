import InsightCard from "./InsightCard";
import Icon from "../common/Icon";
import {
  spendingSummary,
  savingSuggestions,
  unusualTransactions,
  budgetRecommendation,
} from "../../utils/mockData";
import { formatCurrency } from "../../utils/formatCurrency";

export default function InsightsGrid() {
  return (
    <div>
      <div className="mb-5">
        <h2 className="font-semibold text-lg text-ink tracking-tight">AI Insights</h2>
        <p className="text-sm text-muted mt-1">
          Generated from your transaction history
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <InsightCard icon="lightbulb" tone="accent" title={spendingSummary.title}>
          <p>{spendingSummary.description}</p>
        </InsightCard>

        <InsightCard icon="check" tone="positive" title="Top 3 Saving Suggestions">
          <ul className="space-y-2.5">
            {savingSuggestions.map((suggestion) => (
              <li key={suggestion} className="flex items-start gap-2.5">
                <Icon name="check" className="w-4 h-4 text-positive mt-0.5 shrink-0" />
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </InsightCard>

        <InsightCard icon="alert" tone="warn" title="Unusual Transactions">
          <ul className="space-y-3">
            {unusualTransactions.map((transaction) => (
              <li
                key={transaction.id}
                className="flex items-center justify-between rounded-xl bg-warn-light/60 px-3.5 py-2.5"
              >
                <div className="min-w-0 pr-3">
                  <p className="text-sm font-medium text-ink truncate">{transaction.label}</p>
                  <p className="text-xs text-muted mt-0.5">{transaction.note}</p>
                </div>
                <span className="text-sm font-semibold text-warn tabular shrink-0">
                  {formatCurrency(transaction.amount)}
                </span>
              </li>
            ))}
          </ul>
        </InsightCard>

        <InsightCard icon="target" tone="accent" title={budgetRecommendation.title}>
          <p>{budgetRecommendation.description}</p>
        </InsightCard>
      </div>
    </div>
  );
}
