import { useCallback, useState } from "react";
import { uploadExpenseFile } from "../services/api";

export function useExpenseUpload() {
  const [status, setStatus] = useState("idle"); // idle | uploading | analyzing | done
  const [fileName, setFileName] = useState(null);

  const startAnalysis = useCallback(async (file) => {
    setFileName(file?.name ?? "expenses.csv");
    setStatus("uploading");

    await uploadExpenseFile(file);

    setStatus("analyzing");

    await new Promise((resolve) => setTimeout(resolve, 2000));

    setStatus("done");
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setFileName(null);
  }, []);

  return { status, fileName, startAnalysis, reset };
}
