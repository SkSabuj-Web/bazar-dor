
const API_BASES = [
  "https://api.api-store.workers.dev/api/bazardor",
  "https://api.abcz.workers.dev/api/bazardor",
];

export async function apiFetch(path) {
  let lastError;

  for (const base of API_BASES) {
    try {
      const response = await fetch(`${base}${path}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("ডেটা লোড করা যায়নি");
}

export function getList(data, key) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.[key])) return data[key];
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.data?.[key])) return data.data[key];
  return [];
}

export function formatPrice(value) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) return "—";

  return new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 2,
  }).format(amount);
}