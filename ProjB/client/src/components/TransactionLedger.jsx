import { useMemo, useState } from "react";
import { getCategoryIcon } from "../categoryMeta";
import { formatCurrency } from "./SummaryStrip";

export default function TransactionLedger({ transactions, currency }) {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  const categories = useMemo(() => {
    const set = new Set(transactions.map((t) => t.category));
    return ["all", "income", "expense", ...Array.from(set).sort()];
  }, [transactions]);

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchesFilter =
        filter === "all" ||
        filter === t.type ||
        filter === t.category;
      const matchesQuery =
        query.trim() === "" ||
        t.description.toLowerCase().includes(query.toLowerCase()) ||
        t.counterparty.toLowerCase().includes(query.toLowerCase());
      return matchesFilter && matchesQuery;
    });
  }, [transactions, filter, query]);

  return (
    <div className="ledger">
      <div className="ledger__controls">
        <input
          type="text"
          className="ledger__search"
          placeholder="Search by person, company, or description…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="ledger__filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c === "all" ? "All entries" : c === "income" ? "All income" : c === "expense" ? "All expenses" : c}
            </option>
          ))}
        </select>
      </div>

      <div className="ledger__table-wrap">
        <table className="ledger__table">
          <thead>
            <tr>
              <th className="ledger__col-date">Date</th>
              <th className="ledger__col-party">Person / Company</th>
              <th className="ledger__col-category">Category</th>
              <th className="ledger__col-amount">Amount</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t, i) => {
              const Icon = getCategoryIcon(t.category);
              return (
                <tr key={i} className="ledger__row">
                  <td className="ledger__col-date">
                    <span className="ledger__date">{t.date}</span>
                  </td>
                  <td className="ledger__col-party">
                    <span className="ledger__party">{t.counterparty}</span>
                    <span className="ledger__desc">{t.description}</span>
                  </td>
                  <td className="ledger__col-category">
                    <span className={`ledger__tag ledger__tag--${t.type}`}>
                      <Icon size={13} strokeWidth={1.75} />
                      {t.category}
                    </span>
                  </td>
                  <td className="ledger__col-amount">
                    <span
                      className={`ledger__amount ledger__amount--${t.type}`}
                    >
                      {t.type === "income" ? "+" : "−"}
                      {formatCurrency(t.amount, currency)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="ledger__empty">No entries match your search.</div>
        )}
      </div>
    </div>
  );
}
