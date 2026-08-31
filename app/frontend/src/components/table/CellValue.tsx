import { formatIDR } from "../../lib/utils";
import type { Property } from "../../types";

export const CellValue = ({ value, prop }: { value: unknown; prop: Property }) => {
  if (value === null || value === undefined || value === "") {
    return <span style={{ color: "#c8bfb0" }}>—</span>;
  }
  if (prop.type === "currency_idr") {
    return <span style={{ fontSize: 13, fontVariantNumeric: "tabular-nums" }}>{formatIDR(value)}</span>;
  }
  if (prop.type === "checkbox") {
    return (
      <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 18, height: 18, borderRadius: 4, background: value ? prop.color : "#e5dfd7", color: "#fff", fontSize: 11, fontWeight: 700 }}>
        {value ? "✓" : ""}
      </span>
    );
  }
  if (prop.type === "select") {
    return <span style={{ background: prop.color + "1a", color: prop.color, borderRadius: 20, padding: "2px 10px", fontSize: 12, fontWeight: 600 }}>{String(value)}</span>;
  }
  if (prop.type === "multiselect" && Array.isArray(value)) {
    return (
      <span className="flex flex-wrap gap-1">
        {value.map(v => (
          <span key={String(v)} style={{ background: prop.color + "1a", color: prop.color, borderRadius: 20, padding: "2px 8px", fontSize: 11, fontWeight: 600 }}>{String(v)}</span>
        ))}
      </span>
    );
  }
  return <span style={{ fontSize: 13 }} className="whitespace-pre-wrap leading-snug">{String(value)}</span>;
};
