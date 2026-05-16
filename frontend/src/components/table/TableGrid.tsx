import { CellValue } from "./CellValue";
import { IconPaperclip } from "../../components/ui/icons";
import { PAGE_SIZE } from "../../constants";
import type { Table, Row, PropertyType } from "../../types";

const colMinWidth = (type: PropertyType): number =>
  type === "longtext" ? 200 : type === "checkbox" ? 70 : type === "date" ? 110 : type === "currency_idr" ? 150 : 120;

export const TableGrid = ({ table, filtered, page, sortPropId, sortDir, onEditRow, onDeleteRow, onViewAttachments, onSort }: {
  table: Table;
  filtered: Row[];
  page: number;
  sortPropId: string | null;
  sortDir: "asc" | "desc";
  onEditRow: (row: Row) => void;
  onDeleteRow: (row: Row) => void;
  onViewAttachments: (row: Row) => void;
  onSort: (propId: string) => void;
}) => {
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "max-content", background: "#faf8f5" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #e5dfd7" }}>
            {table.properties.map(prop => (
              <th key={prop.id} onClick={() => onSort(prop.id)}
                style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: sortPropId === prop.id ? prop.color : "#8a7d70", textTransform: "uppercase", letterSpacing: "0.08em", cursor: "pointer", whiteSpace: "nowrap", userSelect: "none", minWidth: colMinWidth(prop.type), borderBottom: sortPropId === prop.id ? `2px solid ${prop.color}` : undefined }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: prop.color, display: "inline-block", flexShrink: 0 }} />
                  {prop.name}
                  {sortPropId === prop.id && <span style={{ fontSize: 9 }}>{sortDir === "asc" ? "▲" : "▼"}</span>}
                </span>
              </th>
            ))}
            <th style={{ padding: "10px 16px", minWidth: 60, fontSize: 11, color: "#b0a898", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>Files</th>
            <th style={{ padding: "10px 16px", minWidth: 90 }} />
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
            <tr key={row.id} style={{ borderBottom: "1px solid #ede9e3", background: i % 2 === 0 ? "#faf8f5" : "#f7f4f0" }}>
              {table.properties.map(prop => (
                <td key={prop.id} style={{ padding: "10px 16px", fontSize: 13, color: "#3d3028", verticalAlign: "top", minWidth: colMinWidth(prop.type) }}>
                  <CellValue value={row.values[prop.id]} prop={prop} />
                </td>
              ))}
              <td style={{ padding: "10px 16px", verticalAlign: "top" }}>
                {row.attachments.length > 0 && (
                  <button onClick={() => onViewAttachments(row)}
                    style={{ display: "inline-flex", alignItems: "center", gap: 3, background: "none", border: "none", cursor: "pointer", color: "#8a7d70", padding: 0 }}
                    onMouseEnter={e => e.currentTarget.style.color = table.color}
                    onMouseLeave={e => e.currentTarget.style.color = "#8a7d70"}>
                    <IconPaperclip size={13} />
                    {row.attachments.length > 1 && <span style={{ fontSize: 11, fontWeight: 700 }}>{row.attachments.length}</span>}
                  </button>
                )}
              </td>
              <td style={{ padding: "10px 16px", verticalAlign: "top" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <button onClick={() => onEditRow(row)}
                    style={{ fontSize: 12, color: "#b0a898", background: "none", border: "none", cursor: "pointer" }}
                    onMouseEnter={e => e.currentTarget.style.color = table.color}
                    onMouseLeave={e => e.currentTarget.style.color = "#b0a898"}>
                    Edit
                  </button>
                  <button onClick={() => onDeleteRow(row)}
                    style={{ fontSize: 12, color: "#d38c8c", background: "none", border: "none", cursor: "pointer" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#b55a5a"}
                    onMouseLeave={e => e.currentTarget.style.color = "#d38c8c"}>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
