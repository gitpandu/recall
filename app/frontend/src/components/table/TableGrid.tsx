import { CellValue } from "./CellValue";
import { IconPaperclip } from "../../components/ui/icons";
import { PAGE_SIZE, PROPERTY_MAX_WIDTH } from "../../constants";
import type { Table, Row, PropertyType } from "../../types";

const colMinWidth = (type: PropertyType): number =>
  type === "longtext" ? 200 : type === "checkbox" ? 70 : type === "date" ? 110 : type === "currency_idr" ? 150 : 120;

export const TableGrid = ({ table, filtered, page, sortPropId, sortDir, onEditRow, onViewAttachments, onSort, highlightedRowId }: {
  table: Table;
  filtered: Row[];
  page: number;
  sortPropId: string | null;
  sortDir: "asc" | "desc";
  onEditRow: (row: Row) => void;
  onViewAttachments: (row: Row) => void;
  onSort: (propId: string) => void;
  highlightedRowId?: string | null;
}) => {
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="table-grid-wrapper" style={{ overflowX: "auto", background: "#fff" }}>
      <style>{`
        .table-grid-wrapper { border-radius: 0 0 12px 12px; }
        @media (max-width: 768px) {
          .table-grid-wrapper { border-radius: 0; }
        }
      `}</style>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "max-content" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #e5dfd7", background: "#faf8f5" }}>
            {table.properties.map(prop => (
              <th key={prop.id} onClick={() => onSort(prop.id)}
                style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: sortPropId === prop.id ? prop.color : "#8a7d70", textTransform: "uppercase", letterSpacing: "0.08em", cursor: "pointer", whiteSpace: "nowrap", userSelect: "none", minWidth: colMinWidth(prop.type), maxWidth: PROPERTY_MAX_WIDTH[prop.type], borderBottom: sortPropId === prop.id ? `2px solid ${prop.color}` : undefined }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: prop.color, display: "inline-block", flexShrink: 0 }} />
                  {prop.name}
                  {sortPropId === prop.id && <span style={{ fontSize: 9 }}>{sortDir === "asc" ? "▲" : "▼"}</span>}
                </span>
              </th>
            ))}
            <th style={{ padding: "10px 16px", minWidth: 60, width: 60, fontSize: 11, color: "#b0a898", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, textAlign: "center", verticalAlign: "middle" }}>Files</th>
            <th style={{ padding: "10px 16px", minWidth: 50 }} />
          </tr>
        </thead>
        <tbody>
          {paged.length === 0 && (
            <tr>
              <td colSpan={table.properties.length + 2} style={{ padding: "56px 16px", textAlign: "center", color: "#b0a898", fontSize: 13 }}>
                No records found
              </td>
            </tr>
          )}
          {paged.map((row, i) => (
            <tr key={row.id} style={{ 
              borderBottom: "1px solid #ede9e3", 
              background: row.id === highlightedRowId ? `${table.color}22` : (i % 2 === 0 ? "#fff" : "#faf8f5"),
              transition: "background 0.2s ease"
            }}
            onMouseEnter={e => { if (row.id !== highlightedRowId) e.currentTarget.style.background = "#f4f0eb"; }}
            onMouseLeave={e => { if (row.id !== highlightedRowId) e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#faf8f5"; }}>
              {table.properties.map(prop => (
                <td key={prop.id} style={{ padding: "12px 16px", fontSize: 13, color: "#2d2520", verticalAlign: "top", minWidth: colMinWidth(prop.type), maxWidth: PROPERTY_MAX_WIDTH[prop.type] }}>
                  <div style={{ wordWrap: "break-word", overflowWrap: "break-word" }}>
                    <CellValue value={row.values[prop.id]} prop={prop} />
                  </div>
                </td>
              ))}
              <td style={{ padding: "12px 16px", verticalAlign: "top", textAlign: "center" }}>
                {row.attachments.length > 0 && (
                  <button onClick={() => onViewAttachments(row)}
                    style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 4, background: `${table.color}15`, border: `1px solid ${table.color}30`, borderRadius: 12, cursor: "pointer", color: table.color, padding: "4px 8px", lineHeight: 1, transition: "all 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = `${table.color}25`; }}
                    onMouseLeave={e => { e.currentTarget.style.background = `${table.color}15`; }}>
                    <IconPaperclip size={12} />
                    {row.attachments.length > 1 && <span style={{ fontSize: 11, fontWeight: 700 }}>{row.attachments.length}</span>}
                  </button>
                )}
              </td>
              <td style={{ padding: "12px 16px", verticalAlign: "top", textAlign: "right" }}>
                <button onClick={() => onEditRow(row)}
                  style={{ fontSize: 12, color: "#8a7d70", background: "#fff", border: "1px solid #e5dfd7", borderRadius: 6, cursor: "pointer", padding: "4px 10px", fontWeight: 600, transition: "all 0.15s", opacity: 0.6 }}
                  onMouseEnter={e => { e.currentTarget.style.color = table.color; e.currentTarget.style.borderColor = table.color; e.currentTarget.style.opacity = "1"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "#8a7d70"; e.currentTarget.style.borderColor = "#e5dfd7"; e.currentTarget.style.opacity = "0.6"; }}>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
