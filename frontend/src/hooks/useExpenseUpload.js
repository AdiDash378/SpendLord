import { useCallback, useState } from "react";
import { uploadExpenseFile } from "../services/api";

export function useExpenseUpload() {
  const [status, setStatus] = useState("idle");
  const [fileName, setFileName] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);

  const startAnalysis = useCallback(async (file) => {
    try {
      setError(null);
      setFileName(file?.name ?? "expenses.csv");
      setStatus("uploading");

      const data = await uploadExpenseFile(file);

      setStatus("analyzing");

      // Optional: keeps the loading animation visible briefly
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setDashboardData(data);

      setStatus("done");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to analyze expenses.");
      setStatus("idle");
    }
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setFileName(null);
    setDashboardData(null);
    setError(null);
  }, []);

  return {
    status,
    fileName,
    dashboardData,
    error,
    startAnalysis,
    reset,
  };
}
