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
    style={{ width: "100%", height: "100%", textAlign: "left", background: "#faf8f5", borderRadius: 12, border: "1px solid #e5dfd7", display: "flex", overflow: "hidden", cursor: "pointer", boxShadow: "0 2px 8px rgba(60,45,30,0.03)", transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)" }}
    onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 24px rgba(60,45,30,0.08)"; e.currentTarget.style.borderColor = table.color; e.currentTarget.style.transform = "translateY(-2px)"; }}
    onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 8px rgba(60,45,30,0.03)"; e.currentTarget.style.borderColor = "#e5dfd7"; e.currentTarget.style.transform = "translateY(0)"; }}>
    <div style={{ width: 5, background: table.color, flexShrink: 0 }} />
    <div style={{ padding: "20px 16px", flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", height: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ fontWeight: 700, color: "#2d2520", fontSize: 16 }}>{table.name}</div>
          <button
            onClick={(e) => { e.stopPropagation(); onTogglePin(table); }}
            title={table.pinned ? "Unpin table" : "Pin table"}
            style={{ width: 24, height: 24, border: "none", background: table.pinned ? table.color + "15" : "transparent", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: table.pinned ? table.color : "#b0a898", opacity: table.pinned ? 1 : 0.35, transition: "all 0.15s", padding: 0 }}
            onMouseEnter={(e) => { e.currentTarget.style.color = table.color; e.currentTarget.style.opacity = "1"; e.currentTarget.style.background = table.color + "15"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = table.pinned ? table.color : "#b0a898"; e.currentTarget.style.opacity = table.pinned ? "1" : "0.35"; e.currentTarget.style.background = table.pinned ? table.color + "15" : "transparent"; }}>
            <IconPin size={13} color="currentColor" filled={table.pinned} />
          </button>
        </div>
        {table.description && <div style={{ fontSize: 13, color: "#8a7d70", marginTop: 4, lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{table.description}</div>}
        <div style={{ fontSize: 11, color: "#b0a898", marginTop: 6, fontWeight: 500 }}>{table.rowCount} records · {table.properties.length} properties</div>
        <div style={{ marginTop: "auto", paddingTop: 16 }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {table.properties.slice(0, 5).map(p => (
              <span key={p.id} style={{ background: p.color + "12", color: p.color, fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 600, border: `1px solid ${p.color}30` }}>{p.name}</span>
            ))}
            {table.properties.length > 5 && <span style={{ fontSize: 11, color: "#b0a898", padding: "4px 6px" }}>+{table.properties.length - 5}</span>}
          </div>
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
