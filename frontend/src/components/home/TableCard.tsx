import type { Table } from "../../types";
import { IconPin } from "../../components/ui/icons";

export const TableCard = ({ table, onClick, onTogglePin }: { table: Table; onClick: () => void; onTogglePin: (table: Table) => void }) => (
  <div
    role="button"
    tabIndex={0}
    onClick={onClick}
    onKeyDown={e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick();
      }
    }}
    style={{ width: "100%", textAlign: "left", background: "#faf8f5", borderRadius: 12, border: "1px solid #e5dfd7", display: "flex", overflow: "hidden", cursor: "pointer", boxShadow: "0 1px 4px rgba(60,45,30,0.05)", transition: "box-shadow 0.15s, border-color 0.15s" }}
    onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(60,45,30,0.1)"; e.currentTarget.style.borderColor = table.color; }}
    onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 4px rgba(60,45,30,0.05)"; e.currentTarget.style.borderColor = "#e5dfd7"; }}>
    <div style={{ width: 5, background: table.color, flexShrink: 0 }} />
    <div style={{ padding: 16, flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ fontWeight: 700, color: "#2d2520", fontSize: 15 }}>{table.name}</div>
          <button
            onClick={(e) => { e.stopPropagation(); onTogglePin(table); }}
            title={table.pinned ? "Unpin table" : "Pin table"}
            style={{ width: 20, height: 20, border: "none", background: "transparent", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: table.pinned ? table.color : "#b0a898", opacity: table.pinned ? 1 : 0.35, transition: "color 0.15s, opacity 0.15s", padding: 0 }}
            onMouseEnter={(e) => { e.currentTarget.style.color = table.color; e.currentTarget.style.opacity = "1"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = table.pinned ? table.color : "#b0a898"; e.currentTarget.style.opacity = table.pinned ? "1" : "0.35"; }}>
            <IconPin size={13} color="currentColor" filled={table.pinned} />
          </button>
        </div>
        {table.description && <div style={{ fontSize: 12, color: "#8a7d70", marginTop: 2 }}>{table.description}</div>}
        <div style={{ fontSize: 11, color: "#b0a898", marginTop: 3 }}>{table.rowCount} records · {table.properties.length} properties</div>
        <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap" }}>
          {table.properties.slice(0, 5).map(p => (
            <span key={p.id} style={{ background: p.color + "18", color: p.color, fontSize: 11, padding: "2px 8px", borderRadius: 20, fontWeight: 600 }}>{p.name}</span>
          ))}
          {table.properties.length > 5 && <span style={{ fontSize: 11, color: "#b0a898" }}>+{table.properties.length - 5}</span>}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#c8bfb0" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
    </div>
  </div>
);
