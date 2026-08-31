import type { Table, Row, Property, Attachment } from "../types";

const BASE = "/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  if (res.status === 204) return undefined as T;
  return res.json();
}

// ─── Tables ───────────────────────────────────────────────────────────────────

export const getTables = (): Promise<Table[]> =>
  request("/tables");

export const createTable = (data: { name: string; description: string; color: string; group?: string }): Promise<Table> =>
  request("/tables", { method: "POST", body: JSON.stringify(data) });

export const updateTable = (id: string, data: Partial<Pick<Table, "name" | "description" | "color" | "pinned" | "group">>): Promise<Table> =>
  request(`/tables/${id}`, { method: "PATCH", body: JSON.stringify(data) });

export const deleteTable = (id: string): Promise<void> =>
  request(`/tables/${id}`, { method: "DELETE" });

// ─── Properties ───────────────────────────────────────────────────────────────

export const getProperties = (tableId: string): Promise<Property[]> =>
  request(`/tables/${tableId}/properties`);

export const createProperty = (tableId: string, data: Omit<Property, "id">): Promise<Property> =>
  request(`/tables/${tableId}/properties`, { method: "POST", body: JSON.stringify(data) });

export const updateProperty = (tableId: string, propertyId: string, data: Partial<Omit<Property, "id">>): Promise<Property> =>
  request(`/tables/${tableId}/properties/${propertyId}`, { method: "PATCH", body: JSON.stringify(data) });

export const deleteProperty = (tableId: string, propertyId: string): Promise<void> =>
  request(`/tables/${tableId}/properties/${propertyId}`, { method: "DELETE" });

// ─── Rows ─────────────────────────────────────────────────────────────────────

export const getRows = (tableId: string): Promise<Row[]> =>
  request(`/tables/${tableId}/rows`);

export const createRow = (tableId: string, data: { values: Record<string, unknown> }): Promise<Row> =>
  request(`/tables/${tableId}/rows`, { method: "POST", body: JSON.stringify(data) });

export const updateRow = (tableId: string, rowId: string, data: { values: Record<string, unknown> }): Promise<Row> =>
  request(`/tables/${tableId}/rows/${rowId}`, { method: "PATCH", body: JSON.stringify(data) });

export const deleteRow = (tableId: string, rowId: string): Promise<void> =>
  request(`/tables/${tableId}/rows/${rowId}`, { method: "DELETE" });

// ─── Attachments ──────────────────────────────────────────────────────────────

export const getAttachments = (rowId: string): Promise<Attachment[]> =>
  request(`/rows/${rowId}/attachments`);

export const uploadAttachment = (rowId: string, file: File): Promise<Attachment> => {
  const form = new FormData();
  form.append("file", file);
  return fetch(`${BASE}/rows/${rowId}/attachments`, { method: "POST", body: form })
    .then(res => { if (!res.ok) throw new Error(`${res.status}`); return res.json(); });
};

export const deleteAttachment = (rowId: string, attachmentId: string): Promise<void> =>
  request(`/rows/${rowId}/attachments/${attachmentId}`, { method: "DELETE" });
