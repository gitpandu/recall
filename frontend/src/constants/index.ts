import type { PropertyType } from "../types";

export const PROPERTY_TYPES: PropertyType[] = [
  "text",
  "longtext",
  "number",
  "currency_idr",
  "date",
  "checkbox",
  "select",
  "multiselect",
];

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  text: "Text",
  longtext: "Long Text",
  number: "Number",
  currency_idr: "Price (IDR)",
  date: "Date",
  checkbox: "Checkbox",
  select: "Select",
  multiselect: "Multi-select",
};

export const TABLE_COLORS = [
  "#c0764a", "#4a7fb5", "#4a9e6b", "#7b68b5",
  "#b55a5a", "#4a9e9e", "#b58c4a", "#7a8a70",
  "#c06080", "#5a7ab5", "#9e6b4a", "#6b9e4a",
  "#a04a9e", "#4ab5a0", "#808040", "#b57a4a",
];

export const PROPERTY_TYPE_META: Record<PropertyType, { bg: string; text: string }> = {
  text:         { bg: "#dbeafe", text: "#2563eb" },
  longtext:     { bg: "#ede9fe", text: "#7c3aed" },
  number:       { bg: "#fef3c7", text: "#d97706" },
  currency_idr: { bg: "#fce7f3", text: "#db2777" },
  date:         { bg: "#d1fae5", text: "#059669" },
  checkbox:     { bg: "#dcfce7", text: "#16a34a" },
  select:       { bg: "#fce7f3", text: "#db2777" },
  multiselect:  { bg: "#ffedd5", text: "#ea580c" },
};

export const PAGE_SIZE = 10;