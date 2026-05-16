import type { Table } from "../../types";

export const TableCard = ({ table, onClick }: { table: Table; onClick: () => void }) => (
  <button onClick={onClick}
    style={{ width: "100%", textAlign: "left", background: "#faf8f5", borderRadius: 12, border: "1px solid #e5dfd7", display: "flex", overflow: "hidden", cursor: "pointer", boxShadow: "0 1px 4px rgba(60,45,30,0.05)", transition: "box-shadow 0.15s, border-color 0.15s" }}
    onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(60,45,30,0.1)"; e.currentTarget.style.borderColor = table.color; }}
    onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 4px rgba(60,45,30,0.05)"; e.currentTarget.style.borderColor = "#e5dfd7"; }}>
    <div style={{ width: 5, background: table.color, flexShrink: 0 }} />
    <div style={{ padding: 16, flex: 1 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontWeight: 700, color: "#2d2520", fontSize: 15 }}>{table.name}</div>
          {table.description && <div style={{ fontSize: 12, color: "#8a7d70", marginTop: 2 }}>{table.description}</div>}
          <div style={{ fontSize: 11, color: "#b0a898", marginTop: 3 }}>{table.rowCount} records · {table.properties.length} properties</div>
        </div>
        <span style={{ color: "#c8bfb0", fontSize: 18 }}>›</span>
      </div>
      <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap" }}>
        {table.properties.slice(0, 5).map(p => (
          <span key={p.id} style={{ background: p.color + "18", color: p.color, fontSize: 11, padding: "2px 8px", borderRadius: 20, fontWeight: 600 }}>{p.name}</span>
        ))}
        {table.properties.length > 5 && <span style={{ fontSize: 11, color: "#b0a898" }}>+{table.properties.length - 5}</span>}
      </div>
    </div>
  </button>
);