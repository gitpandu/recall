export type PropertyType =
  | "text"
  | "longtext"
  | "number"
  | "currency_idr"
  | "date"
  | "checkbox"
  | "select"
  | "multiselect";

export interface Property {
  id: string;
  name: string;
  type: PropertyType;
  options?: string[];
  color: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
}

export interface Row {
  id: string;
  tableId: string;
  values: Record<string, unknown>;
  attachments: Attachment[];
  createdAt: string;
  updatedAt: string;
}

export interface Table {
  id: string;
  name: string;
  description: string;
  color: string;
  properties: Property[];
  rowCount: number;
  rows: Row[];
}
