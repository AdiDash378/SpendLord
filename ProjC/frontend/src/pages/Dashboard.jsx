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
  const { status, dashboardData, error, startAnalysis, reset } =
    useExpenseUpload();

  const isAnalyzing = status === "uploading" || status === "analyzing";
  const isDone = status === "done";

  const loadingLabel =
    status === "uploading"
      ? "Uploading statement…"
      : "Analyzing with AI — this may take up to a minute…";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 lg:px-8 py-10 w-full">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
              AI Bank Statement Analyzer
            </h1>
            <p className="text-ink-soft mt-1">
              Upload a PDF bank statement to see where your money is going.
            </p>
          </div>
          {isDone && (
            <Button variant="ghost" size="sm" onClick={reset}>
              Analyze another file
            </Button>
          )}
        </div>

        {!isDone && (
          <>
            <div className="max-w-xl">
              <UploadCard onAnalyze={startAnalysis} disabled={isAnalyzing} />
            </div>

            {error && (
              <div className="mt-4 max-w-xl rounded-lg border border-red-300 bg-red-100 p-3 text-red-700 text-sm">
                {error}
              </div>
            )}
          </>
        )}

        {isAnalyzing && <LoadingSpinner label={loadingLabel} />}

        {isDone && dashboardData && (
          <div className="space-y-8 animate-fade-up">
            <StatsGrid statistics={dashboardData.statistics} />

            <div className="grid lg:grid-cols-2 gap-5">
              <PieChartCard categoryData={dashboardData.charts.categoryData} />
              <BarChartCard monthlyData={dashboardData.charts.monthlyData} />
            </div>

            <InsightsGrid aiInsights={dashboardData.aiInsights} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
