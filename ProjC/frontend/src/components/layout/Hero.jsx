import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../common/Icon";
import { heroTicker } from "../../utils/mockData";
import { formatCurrency } from "../../utils/formatCurrency";

const categoryStyle = {
  Food: "bg-accent-light text-accent-dark",
  Transport: "bg-positive-light text-positive",
  Shopping: "bg-warn-light text-warn",
  Bills: "bg-ink/5 text-ink-soft",
  Entertainment: "bg-accent-light text-accent-dark",
};

export default function Hero() {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (visibleCount >= heroTicker.length) return;
    const timer = setTimeout(() => {
      setVisibleCount((count) => count + 1);
    }, 550);
    return () => clearTimeout(timer);
  }, [visibleCount]);

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-28">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent bg-accent-light px-3 py-1 rounded-full">
            <Icon name="sparkles" className="w-3.5 h-3.5" />
            AI-powered, built for a weekend
          </span>

          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold tracking-tight text-ink leading-[1.08]">
            Know exactly where your money went.
          </h1>

          <p className="mt-5 text-lg text-ink-soft max-w-md leading-relaxed">
            Upload a bank statement and let AI categorize every transaction,
            surface unusual spending, and recommend a budget that actually
            fits how you live.
          </p>

          <div className="mt-8 flex items-center gap-4">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 bg-accent text-white font-semibold px-7 py-3.5 rounded-xl shadow-glow hover:bg-accent-dark hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              Analyze Expenses
              <Icon name="arrowRight" className="w-4 h-4" />
            </Link>
            <span className="text-sm text-muted">No sign-up needed</span>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 bg-accent/5 rounded-3xl blur-2xl" aria-hidden="true" />
          <div className="relative bg-surface border border-border rounded-2xl shadow-card-hover p-6">
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm font-semibold text-ink-soft">Live categorization</p>
              <span className="flex items-center gap-1.5 text-xs text-positive font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-positive animate-pulse-ring" />
                Processing
              </span>
            </div>

            <ul className="space-y-2.5">
              {heroTicker.map((item, index) => (
                <li
                  key={item.label}
                  className={`flex items-center justify-between rounded-xl border border-border px-4 py-3 ${
                    index < visibleCount ? "animate-sort-in opacity-100" : "opacity-0"
                  }`}
                  style={{ animationDelay: "0ms" }}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{item.label}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        categoryStyle[item.category] ?? "bg-ink/5 text-ink-soft"
                      }`}
                    >
                      {item.category}
                    </span>
                    <span className="text-sm font-semibold text-ink tabular w-16 text-right">
                      {formatCurrency(item.amount)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
