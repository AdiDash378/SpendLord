import { useState } from "react";
import { Download, FileJson2, Loader2, AlertTriangle, RotateCcw } from "lucide-react";
import UploadSlip from "./components/UploadSlip.jsx";
import SummaryStrip from "./components/SummaryStrip.jsx";
import TransactionLedger from "./components/TransactionLedger.jsx";
import Dashboard from "./components/Dashboard.jsx";
import { parseStatement } from "./api.js";
import "./App.css";

const LOADING_MESSAGES = [
  "Reading the statement…",
  "Sorting income from expenses…",
  "Matching counterparties…",
  "Tallying the totals…",
];

export default function App() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const [view, setView] = useState("insights"); // insights | ledger

  const handleFileSelected = (selected) => {
    setFile(selected);
    setStatus("idle");
    setError(null);
    setResult(null);
  };

  const handleClear = () => {
    setFile(null);
    setStatus("idle");
    setError(null);
    setResult(null);
    setView("insights");
  };

  const handleSubmit = async () => {
    if (!file) return;
    setStatus("loading");
    setError(null);

    const msgInterval = setInterval(() => {
      setLoadingMsgIndex((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 1800);

    try {
      const data = await parseStatement(file);
      setResult(data);
      setStatus("success");
      setView("insights");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    } finally {
      clearInterval(msgInterval);
    }
  };

  const handleDownloadJson = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(file?.name || "statement").replace(/\.pdf$/i, "")}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page">
      <header className="header">
        <div className="header__mark">No. 01</div>
        <h1 className="header__title">Ledger</h1>
        <p className="header__subtitle">
          Turn a bank statement PDF into clean, categorized JSON — income vs.
          expense, who it was with, and when.
        </p>
      </header>

      <main className="main">
        <section className="panel">
          <UploadSlip
            file={file}
            onFileSelected={handleFileSelected}
            onClear={handleClear}
            disabled={status === "loading"}
          />

          {file && status !== "success" && (
            <button
              type="button"
              className="btn btn--primary"
              onClick={handleSubmit}
              disabled={status === "loading"}
            >
              {status === "loading" ? (
                <>
                  <Loader2 size={16} className="spin" />
                  {LOADING_MESSAGES[loadingMsgIndex]}
                </>
              ) : (
                "Parse statement"
              )}
            </button>
          )}

          {status === "error" && (
            <div className="alert">
              <AlertTriangle size={18} strokeWidth={1.75} />
              <div>
                <strong>Couldn't parse that statement.</strong>
                <p>{error}</p>
              </div>
            </div>
          )}
        </section>

        {status === "success" && result && (
          <section className="results">
            <div className="results__meta">
              <div className="results__meta-info">
                {result.bankName && <span>{result.bankName}</span>}
                {result.accountHolder && <span>{result.accountHolder}</span>}
                {result.statementPeriod?.startDate && (
                  <span>
                    {result.statementPeriod.startDate} →{" "}
                    {result.statementPeriod.endDate}
                  </span>
                )}
              </div>
              <div className="results__actions">
                <button className="btn btn--ghost" onClick={handleClear}>
                  <RotateCcw size={15} strokeWidth={1.75} />
                  New statement
                </button>
                <button className="btn btn--secondary" onClick={handleDownloadJson}>
                  <Download size={15} strokeWidth={1.75} />
                  Download JSON
                </button>
              </div>
            </div>

            <SummaryStrip summary={result.summary} currency={result.currency} />

            <div className="tabs">
              <button
                className={`tabs__tab ${view === "insights" ? "tabs__tab--active" : ""}`}
                onClick={() => setView("insights")}
              >
                Insights
              </button>
              <button
                className={`tabs__tab ${view === "ledger" ? "tabs__tab--active" : ""}`}
                onClick={() => setView("ledger")}
              >
                Ledger
              </button>
            </div>

            {view === "insights" && result.insights && (
              <Dashboard insights={result.insights} currency={result.currency} />
            )}

            {view === "ledger" && (
              <TransactionLedger
                transactions={result.transactions}
                currency={result.currency}
              />
            )}
          </section>
        )}
      </main>

      <footer className="footer">
        <FileJson2 size={14} strokeWidth={1.75} />
        <span>Parsed with Gemini · processed in memory, never stored</span>
      </footer>
    </div>
  );
}
