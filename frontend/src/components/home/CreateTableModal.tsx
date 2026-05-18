import { useState } from "react";
import { Modal } from "../../components/ui/Modal";
import { IconX } from "../../components/ui/icons";
import { TABLE_COLORS } from "../../constants";

export const CreateTableModal = ({ onClose, onCreate }: {
  onClose: () => void;
  onCreate: (t: { name: string; description: string; color: string }) => void;
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(TABLE_COLORS[0]);

  const handleCreate = () => {
    if (!name.trim()) return;
    onCreate({
      name: name.trim(),
      description: description.trim(),
      color,
    });
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <div style={{ padding: 28 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: "#2d2520", margin: 0 }}>New Table</h2>
          <button onClick={onClose}
            style={{ color: "#b0a898", background: "#f5f2ee", border: "none", cursor: "pointer", padding: 8, borderRadius: "50%", display: "flex", transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#e5dfd7"; e.currentTarget.style.color = "#2d2520"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#f5f2ee"; e.currentTarget.style.color = "#b0a898"; }}>
            <IconX size={14} />
          </button>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, color: "#8a7d70", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, display: "block", marginBottom: 8 }}>Color</label>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {TABLE_COLORS.map(c => (
              <button key={c} onClick={() => setColor(c)}
                style={{ width: 26, height: 26, borderRadius: "50%", background: c, border: "none", cursor: "pointer", outline: color === c ? `3px solid ${c}` : "none", outlineOffset: 2 }} />
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, color: "#8a7d70", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, display: "block", marginBottom: 8 }}>Name</label>
          <input value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === "Enter" && handleCreate()} placeholder="e.g. Purchases" autoFocus
            style={{ width: "100%", border: `1.5px solid ${color}`, borderRadius: 10, padding: "12px 14px", fontSize: 15, color: "#2d2520", outline: "none", background: "#fff", boxSizing: "border-box", transition: "all 0.2s", boxShadow: `0 0 0 3px ${color}1a` }} />
        </div>

        <div style={{ marginBottom: 32 }}>
          <label style={{ fontSize: 11, color: "#8a7d70", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, display: "block", marginBottom: 8 }}>Description</label>
          <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Short description…"
            style={{ width: "100%", border: "1.5px solid #e5dfd7", borderRadius: 10, padding: "12px 14px", fontSize: 14, color: "#2d2520", outline: "none", background: "#fff", boxSizing: "border-box", transition: "all 0.2s" }}
            onFocus={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.boxShadow = `0 0 0 3px ${color}1a`; }}
            onBlur={e => { e.currentTarget.style.borderColor = "#e5dfd7"; e.currentTarget.style.boxShadow = "none"; }} />
        </div>

        <button onClick={handleCreate}
          style={{ width: "100%", background: color, color: "#fff", border: "none", borderRadius: 12, padding: "14px 20px", fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: `0 4px 12px ${color}40`, transition: "all 0.15s" }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = `0 6px 16px ${color}55`; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 4px 12px ${color}40`; }}>
          Create Table
        </button>
      </div>
    </Modal>
  );
};
