import { Link, useLocation } from "react-router-dom";
import Icon from "../common/Icon";

export default function Navbar() {
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";

  return (
    <header className="sticky top-0 z-50 bg-canvas/80 backdrop-blur-md border-b border-border">
      <nav className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="w-8 h-8 rounded-lg bg-ink flex items-center justify-center text-white group-hover:bg-accent transition-colors duration-200">
            <Icon name="wallet" className="w-4 h-4" />
          </span>
          <span className="font-semibold tracking-tight text-ink">
            AI Expense Analyzer
          </span>
        </Link>

        {!isDashboard && (
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 bg-accent text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-glow hover:bg-accent-dark hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            Analyze Expenses
            <Icon name="arrowRight" className="w-3.5 h-3.5" />
          </Link>
        )}
      </nav>
    </header>
  );
}
