import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import UploadCard from "../components/upload/UploadCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import StatsGrid from "../components/dashboard/StatsGrid";
import PieChartCard from "../components/charts/PieChartCard";
import BarChartCard from "../components/charts/BarChartCard";
import InsightsGrid from "../components/insights/InsightsGrid";
import Button from "../components/common/Button";
import { useExpenseUpload } from "../hooks/useExpenseUpload";

export default function Dashboard() {
  const { status, startAnalysis, reset } = useExpenseUpload();

  const isAnalyzing = status === "uploading" || status === "analyzing";
  const isDone = status === "done";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 lg:px-8 py-10 w-full">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
              AI Expense Analyzer
            </h1>
            <p className="text-ink-soft mt-1">
              Upload a statement to see where your money is going.
            </p>
          </div>
          {isDone && (
            <Button variant="ghost" size="sm" onClick={reset}>
              Upload another file
            </Button>
          )}
        </div>

        {!isDone && (
          <div className="max-w-xl">
            <UploadCard onAnalyze={startAnalysis} disabled={isAnalyzing} />
          </div>
        )}

        {isAnalyzing && <LoadingSpinner label="Analyzing your expenses..." />}

        {isDone && (
          <div className="space-y-8 animate-fade-up">
            <StatsGrid />

            <div className="grid lg:grid-cols-2 gap-5">
              <PieChartCard />
              <BarChartCard />
            </div>

            <InsightsGrid />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
