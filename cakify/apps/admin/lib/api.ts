const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

async function request<T>(path: string, init?: RequestInit) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json"
    },
    cache: "no-store",
    ...init
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  return (await res.json()) as T;
}

export const AdminApi = {
  listOrders: () => request("/orders"),
  listBakers: () => request("/bakers"),
  listPromos: async () => [{ code: "WELCOME10", discountPercent: 10, isActive: true }]
};
