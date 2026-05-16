export const generateId = (): string => Math.random().toString(36).slice(2, 10);

export const formatIDR = (val: unknown): string => {
  const n = Number(val);
  if (isNaN(n)) return "—";
  return "Rp" + Math.round(n).toLocaleString("id-ID");
};