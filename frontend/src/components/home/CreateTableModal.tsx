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
      <div style={{ padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, color: "#2d2520" }}>New Table</h2>
          <button onClick={onClose} style={{ color: "#b0a898", background: "none", border: "none", cursor: "pointer", padding: 4 }}><IconX size={16} /></button>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, color: "#8a7d70", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, display: "block", marginBottom: 8 }}>Color</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {TABLE_COLORS.map(c => (
              <button key={c} onClick={() => setColor(c)}
                style={{ width: 26, height: 26, borderRadius: "50%", background: c, border: "none", cursor: "pointer", outline: color === c ? `3px solid ${c}` : "none", outlineOffset: 2 }} />
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 11, color: "#8a7d70", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, display: "block", marginBottom: 6 }}>Name</label>
          <input value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === "Enter" && handleCreate()} placeholder="e.g. Purchases" autoFocus
            style={{ width: "100%", border: `1.5px solid ${color}`, borderRadius: 8, padding: "9px 12px", fontSize: 14, color: "#2d2520", outline: "none", background: "#fff", boxSizing: "border-box" }} />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 11, color: "#8a7d70", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, display: "block", marginBottom: 6 }}>Description</label>
          <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Short description…"
            style={{ width: "100%", border: "1.5px solid #e5dfd7", borderRadius: 8, padding: "9px 12px", fontSize: 13, color: "#2d2520", outline: "none", background: "#fff", boxSizing: "border-box" }}
            onFocus={e => e.currentTarget.style.borderColor = color} onBlur={e => e.currentTarget.style.borderColor = "#e5dfd7"} />
        </div>

        <button onClick={handleCreate}
          style={{ width: "100%", background: color, color: "#fff", border: "none", borderRadius: 10, padding: 12, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
          Create Table
        </button>
      </div>
    </Modal>
  );
};
