export interface Table {
  id: string;
  name: string;
  description: string;
  color: string;
  pinned: boolean;
  createdAt: number; // unix epoch
}

export interface Property {
  id: string;
  tableId: string;
  name: string;
  type: string;
  color: string;
  options: string | null;
  order: number;
}

export interface Row {
  id: string;
  tableId: string;
  values: string; // JSON string
  createdAt: number;
  updatedAt: number;
}

export interface Attachment {
  id: string;
  rowId: string;
  name: string;
  filename: string;
  url: string;
}
