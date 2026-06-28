export default function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-sm text-muted">
          © {new Date().getFullYear()} AI Expense Analyzer. Built for a hackathon, not a bank.
        </p>
        <p className="text-sm text-muted">No backend. No data leaves your browser.</p>
      </div>
    </footer>
  );
}
