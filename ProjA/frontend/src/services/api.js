import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000,
  
});

export async function uploadExpenseFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/analyze", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

export async function fetchExpenseAnalysis() {
  // Placeholder only — no backend is connected in this build.
  // const response = await api.get("/expenses/analysis");
  // return response.data;

  return Promise.resolve(null);
}

export default api;
