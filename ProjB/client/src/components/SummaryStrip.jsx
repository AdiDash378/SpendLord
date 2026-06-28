function formatCurrency(amount, currency) {
  const symbol = currency === "USD" ? "$" : currency === "EUR" ? "€" : currency === "GBP" ? "£" : currency === "INR" ? "₹" : "";
  const sign = amount < 0 ? "-" : "";
  const formatted = Math.abs(amount).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return symbol ? `${sign}${symbol}${formatted}` : `${sign}${formatted}`;
}

export default function SummaryStrip({ summary, currency }) {
  const { totalIncome, totalExpense, netChange, transactionCount } = summary;

  return (
    <div className="summary">
      <div className="summary__item">
        <span className="summary__label">In</span>
        <span className="summary__value summary__value--income">
          {formatCurrency(totalIncome, currency)}
        </span>
      </div>
      <div className="summary__divider" />
      <div className="summary__item">
        <span className="summary__label">Out</span>
        <span className="summary__value summary__value--expense">
          {formatCurrency(totalExpense, currency)}
        </span>
      </div>
      <div className="summary__divider" />
      <div className="summary__item">
        <span className="summary__label">Net</span>
        <span
          className={`summary__value ${
            netChange >= 0 ? "summary__value--income" : "summary__value--expense"
          }`}
        >
          {formatCurrency(netChange, currency)}
        </span>
      </div>
      <div className="summary__divider" />
      <div className="summary__item">
        <span className="summary__label">Entries</span>
        <span className="summary__value">{transactionCount}</span>
      </div>
    </div>
  );
}

export { formatCurrency };
