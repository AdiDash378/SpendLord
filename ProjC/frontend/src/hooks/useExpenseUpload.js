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
      setFileName(file?.name ?? "statement.pdf");
      setStatus("uploading");

      const data = await uploadExpenseFile(file);

      setStatus("analyzing");
      await new Promise((resolve) => setTimeout(resolve, 800));

      setDashboardData(data);
      setStatus("done");
    } catch (err) {
      console.error("Upload error full details:", err);

      // Extract the most useful error message available
      const serverMsg = err.response?.data?.error;
      const serverDetail = err.response?.data?.details;
      const networkMsg =
        err.code === "ERR_NETWORK" || err.message?.includes("Network Error")
          ? "Cannot reach the server. Make sure the backend is running on port 4000 (cd server && npm run dev)."
          : null;
      const timeoutMsg =
        err.code === "ECONNABORTED"
          ? "Request timed out. The PDF may be too complex — try a smaller statement."
          : null;

      const displayMsg =
        networkMsg ||
        timeoutMsg ||
        (serverMsg ? (serverDetail ? `${serverMsg} — ${serverDetail}` : serverMsg) : null) ||
        err.message ||
        "Failed to analyze expenses.";

      setError(displayMsg);
      setStatus("idle");
    }
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setFileName(null);
    setDashboardData(null);
    setError(null);
  }, []);

  return { status, fileName, dashboardData, error, startAnalysis, reset };
}
