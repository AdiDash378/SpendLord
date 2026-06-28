const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

export async function parseStatement(file) {
  const formData = new FormData();
  formData.append("statement", file);

  const res = await fetch(`${API_BASE}/api/parse-statement`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to parse statement.");
  }

  return data;
}
