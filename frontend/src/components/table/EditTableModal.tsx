import { useEffect, useState } from "react";
import { Modal } from "../../components/ui/Modal";
import { IconX } from "../../components/ui/icons";
import type { Table } from "../../types";

export const EditTableModal = ({ table, onClose, onSave, onDelete }: {
  table: Table;
  onClose: () => void;
  onSave: (table: Table) => Promise<void>;
  onDelete: (tableId: string) => Promise<void>;
}) => {
  const [name, setName] = useState(table.name);
  const [description, setDescription] = useState(table.description);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(table.name);
    setDescription(table.description);
  }, [table.id, table.name, table.description]);

  const handleSave = async () => {
    const next = { ...table, name: name.trim() || table.name, description: description.trim() };
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
      <div style={{ padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, color: "#2d2520" }}>Edit Table</h2>
          <button onClick={onClose} style={{ color: "#b0a898", background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <IconX size={16} />
          </button>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 11, color: "#8a7d70", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, display: "block", marginBottom: 6 }}>Title</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            style={{ width: "100%", border: "1.5px solid #e5dfd7", borderRadius: 8, padding: "9px 12px", fontSize: 14, color: "#2d2520", outline: "none", background: "#fff", boxSizing: "border-box" }}
            onFocus={e => e.currentTarget.style.borderColor = table.color}
            onBlur={e => e.currentTarget.style.borderColor = "#e5dfd7"}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 11, color: "#8a7d70", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, display: "block", marginBottom: 6 }}>Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            style={{ width: "100%", border: "1.5px solid #e5dfd7", borderRadius: 8, padding: "9px 12px", fontSize: 13, color: "#2d2520", outline: "none", background: "#fff", boxSizing: "border-box", resize: "none", fontFamily: "inherit" }}
            onFocus={e => e.currentTarget.style.borderColor = table.color}
            onBlur={e => e.currentTarget.style.borderColor = "#e5dfd7"}
            placeholder="Add a description..."
          />
        </div>

        <button
          onClick={() => { void handleSave(); }}
          disabled={saving}
          style={{ width: "100%", background: table.color, color: "#fff", border: "none", borderRadius: 10, padding: 12, fontSize: 14, fontWeight: 700, cursor: saving ? "default" : "pointer", opacity: saving ? 0.75 : 1 }}
        >
          {saving ? "Saving..." : "Save changes"}
        </button>

        <button
          onClick={() => { void handleDelete(); }}
          style={{ width: "100%", marginTop: 10, background: "#fff", color: "#b55a5a", border: "1px solid #e8c9c9", borderRadius: 10, padding: 12, fontSize: 14, fontWeight: 700, cursor: "pointer" }}
        >
          Delete table
        </button>
      </div>
    </Modal>
  );
};
