import CategoryChart from "./CategoryChart.jsx";
import MonthlyTrendChart from "./MonthlyTrendChart.jsx";
import SubscriptionsCard from "./SubscriptionsCard.jsx";
import NextMonthCard from "./NextMonthCard.jsx";
import SuggestionsCard from "./SuggestionsCard.jsx";

export default function Dashboard({ insights, currency }) {
  const {
    subscriptions,
    nextMonth,
    categoryBreakdown,
    monthlyBreakdown,
    suggestions,
  } = insights;

  return (
    <div className="dashboard">
      <div className="dashboard__section-label">Insights</div>

      <div className="dashboard__charts">
        <CategoryChart data={categoryBreakdown} currency={currency} />
        <MonthlyTrendChart data={monthlyBreakdown} currency={currency} />
      </div>

      <div className="dashboard__cards">
        <SubscriptionsCard subscriptions={subscriptions} currency={currency} />
        <NextMonthCard nextMonth={nextMonth} currency={currency} />
        <SuggestionsCard suggestions={suggestions} currency={currency} />
      </div>
    </div>
  );
}
