import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function uploadExpenseFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  // Placeholder only — no backend is connected in this build.
  // Replace with a real endpoint when the API is ready, e.g.:
  // const response = await api.post("/expenses/upload", formData, {
  //   headers: { "Content-Type": "multipart/form-data" },
  // });
  // return response.data;

  return Promise.resolve({ status: "mocked", fileName: file?.name ?? null });
}

export async function fetchExpenseAnalysis() {
  // Placeholder only — no backend is connected in this build.
  // const response = await api.get("/expenses/analysis");
  // return response.data;

  return Promise.resolve(null);
}

export default api;
