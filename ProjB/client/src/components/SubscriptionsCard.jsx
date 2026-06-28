import { Repeat } from "lucide-react";
import { getCategoryIcon } from "../categoryMeta";
import { formatCurrency } from "./SummaryStrip";

function formatCadence(cadence) {
  return { weekly: "Weekly", biweekly: "Every 2 weeks", monthly: "Monthly", quarterly: "Quarterly", yearly: "Yearly" }[cadence] || cadence;
}

export default function SubscriptionsCard({ subscriptions, currency }) {
  if (subscriptions.length === 0) {
    return (
      <div className="card">
        <h3 className="card__title">
          <Repeat size={16} strokeWidth={1.75} />
          Subscriptions
        </h3>
        <p className="card__empty">
          No recurring charges detected in this statement.
        </p>
      </div>
    );
  }

  const totalMonthly = subscriptions.reduce((s, sub) => s + sub.annualCost / 12, 0);

  return (
    <div className="card">
      <h3 className="card__title">
        <Repeat size={16} strokeWidth={1.75} />
        Subscriptions
        <span className="card__title-tag">
          ~{formatCurrency(totalMonthly, currency)}/mo
        </span>
      </h3>
      <ul className="sub-list">
        {subscriptions.map((sub) => {
          const Icon = getCategoryIcon(sub.category);
          return (
            <li key={sub.counterparty} className="sub-list__item">
              <div className="sub-list__icon">
                <Icon size={15} strokeWidth={1.75} />
              </div>
              <div className="sub-list__info">
                <span className="sub-list__name">{sub.counterparty}</span>
                <span className="sub-list__meta">
                  {formatCadence(sub.cadence)} · next ~{sub.nextExpectedDate}
                </span>
              </div>
              <span className="sub-list__amount">
                {formatCurrency(sub.averageAmount, currency)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
