const BASE_URL = import.meta.env.VITE_API_URL;
export async function apiRequest(endpoint, method = "GET", body) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: body ? JSON.stringify(body) : null
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    console.error("Backend error:", data);
    throw new Error(data.message || "Request failed");
  }

  return data;
}
