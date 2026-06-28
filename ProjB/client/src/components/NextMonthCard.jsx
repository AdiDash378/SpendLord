import { CalendarClock } from "lucide-react";
import { formatCurrency } from "./SummaryStrip";

export default function NextMonthCard({ nextMonth, currency }) {
  const { estimatedSubscriptionCharges, estimatedOtherSpend, estimatedTotal } = nextMonth;

  return (
    <div className="card">
      <h3 className="card__title">
        <CalendarClock size={16} strokeWidth={1.75} />
        Next month, estimated
      </h3>

      <div className="estimate">
        <span className="estimate__total">{formatCurrency(estimatedTotal, currency)}</span>
        <span className="estimate__label">projected total spend</span>
      </div>

      <div className="estimate__breakdown">
        <div className="estimate__row">
          <span>Known subscriptions</span>
          <span>{formatCurrency(estimatedSubscriptionCharges, currency)}</span>
        </div>
        <div className="estimate__row">
          <span>Typical other spending</span>
          <span>{formatCurrency(estimatedOtherSpend, currency)}</span>
        </div>
      </div>

      <p className="card__footnote">
        Based on detected recurring charges and your average non-subscription
        spend per month in this statement. More months of data sharpen this.
      </p>
    </div>
  );
}
