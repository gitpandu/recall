import { useEffect, useState } from "react";
import { Modal } from "../../components/ui/Modal";
import { IconX } from "../../components/ui/icons";
import { TABLE_COLORS } from "../../constants";
import type { Table } from "../../types";

export const EditTableModal = ({ table, onClose, onSave, onDelete }: {
  table: Table;
  onClose: () => void;
  onSave: (table: Table) => Promise<void>;
  onDelete: (tableId: string) => Promise<void>;
}) => {
  const [name, setName] = useState(table.name);
  const [description, setDescription] = useState(table.description);
  const [color, setColor] = useState(table.color);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(table.name);
    setDescription(table.description);
    setColor(table.color);
  }, [table.id, table.name, table.description, table.color]);

  const handleSave = async () => {
    const next = { ...table, name: name.trim() || table.name, description: description.trim(), color };
    try {
      setSaving(true);
      await onSave(next);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const ok = window.confirm(`Delete table "${table.name}" and all its rows and attachments?`);
    if (!ok) return;
    await onDelete(table.id);
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <div style={{ padding: 28 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: "#2d2520", margin: 0 }}>Table Settings</h2>
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
          <label style={{ fontSize: 11, color: "#8a7d70", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, display: "block", marginBottom: 8 }}>Title</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            style={{ width: "100%", border: "1.5px solid #e5dfd7", borderRadius: 10, padding: "12px 14px", fontSize: 15, color: "#2d2520", outline: "none", background: "#fff", boxSizing: "border-box", transition: "all 0.2s" }}
            onFocus={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.boxShadow = `0 0 0 3px ${color}1a`; }}
            onBlur={e => { e.currentTarget.style.borderColor = "#e5dfd7"; e.currentTarget.style.boxShadow = "none"; }}
          />
        </div>

        <div style={{ marginBottom: 32 }}>
          <label style={{ fontSize: 11, color: "#8a7d70", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, display: "block", marginBottom: 8 }}>Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            style={{ width: "100%", border: "1.5px solid #e5dfd7", borderRadius: 10, padding: "12px 14px", fontSize: 14, color: "#2d2520", outline: "none", background: "#fff", boxSizing: "border-box", resize: "none", fontFamily: "inherit", transition: "all 0.2s" }}
            onFocus={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.boxShadow = `0 0 0 3px ${color}1a`; }}
            onBlur={e => { e.currentTarget.style.borderColor = "#e5dfd7"; e.currentTarget.style.boxShadow = "none"; }}
            placeholder="Add a description..."
          />
        </div>

        <button
          onClick={() => { void handleSave(); }}
          disabled={saving}
          style={{ width: "100%", background: color, color: "#fff", border: "none", borderRadius: 12, padding: "14px 20px", fontSize: 15, fontWeight: 700, cursor: saving ? "default" : "pointer", opacity: saving ? 0.75 : 1, boxShadow: `0 4px 12px ${color}40`, transition: "all 0.15s" }}
          onMouseEnter={e => { if (!saving) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = `0 6px 16px ${color}55`; } }}
          onMouseLeave={e => { if (!saving) { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 4px 12px ${color}40`; } }}
        >
          {saving ? "Saving..." : "Save changes"}
        </button>

        <button
          onClick={() => { void handleDelete(); }}
          style={{ width: "100%", marginTop: 12, background: "#fff", color: "#b55a5a", border: "1.5px solid #e8c9c9", borderRadius: 12, padding: "14px 20px", fontSize: 15, fontWeight: 700, cursor: "pointer", transition: "all 0.15s" }}
          onMouseEnter={e => { e.currentTarget.style.background = "#fdf4f4"; e.currentTarget.style.borderColor = "#dfa9a9"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#e8c9c9"; }}
        >
          Delete table
        </button>
      </div>
    </Modal>
  );
};
