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
  // Warm
  "#c0764a", // orange-brown
  "#b55a5a", // muted red
  "#c06080", // rose
  "#b84c6e", // raspberry
  "#c0534a", // terracotta
  "#b5704a", // amber-brown

  // Cool
  "#4a7fb5", // steel blue
  "#5a7ab5", // periwinkle
  "#4a9e9e", // teal
  "#4ab5a0", // seafoam
  "#4a6eb5", // cobalt
  "#4a8fa0", // slate teal

  // Neutral-warm
  "#b58c4a", // gold
  "#808040", // olive
  "#b57a4a", // sand
  "#9e6b4a", // sienna
  "#a08040", // dark gold
  "#7a8a70", // sage

  // Green / purple
  "#4a9e6b", // mint green
  "#6b9e4a", // lime green
  "#7b68b5", // soft violet
  "#a04a9e", // purple
  "#7a4ab5", // indigo-violet
  "#9e4a7a", // plum
];

export const PROPERTY_TYPE_META: Record<PropertyType, { bg: string; text: string }> = {
  text: { bg: "#dbeafe", text: "#2563eb" },
  longtext: { bg: "#ede9fe", text: "#7c3aed" },
  number: { bg: "#fef3c7", text: "#d97706" },
  currency_idr: { bg: "#fce7f3", text: "#db2777" },
  date: { bg: "#d1fae5", text: "#059669" },
  checkbox: { bg: "#dcfce7", text: "#16a34a" },
  select: { bg: "#fce7f3", text: "#db2777" },
  multiselect: { bg: "#ffedd5", text: "#ea580c" },
};

export const PROPERTY_MAX_WIDTH: Record<PropertyType, number> = {
  text: 300,
  longtext: 500,
  number: 150,
  currency_idr: 200,
  date: 150,
  checkbox: 100,
  select: 200,
  multiselect: 250,
};

export const PAGE_SIZE = 10;