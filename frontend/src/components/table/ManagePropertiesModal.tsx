import { useState } from "react";
import { Modal } from "../../components/ui/Modal";
import { ColorDot } from "../../components/ui/ColorDot";
import { PropertyTypeBadge } from "../../components/ui/PropertyTypeBadge";
import { IconX } from "../../components/ui/icons";
import { PROPERTY_TYPES, PROPERTY_TYPE_LABELS, TABLE_COLORS } from "../../constants";
import { generateId } from "../../lib/utils";
import type { Table, Property, PropertyType } from "../../types";

export const ManagePropertiesModal = ({ table, onClose, onSave }: {
  table: Table;
  onClose: () => void;
  onSave: (props: Property[]) => void;
}) => {
  const [properties, setProperties] = useState<Property[]>(table.properties.map(p => ({ ...p })));
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<PropertyType>("text");
  const [newColor, setNewColor] = useState(TABLE_COLORS[3]);

  const addProp = () => {
    if (!newName.trim()) return;
    setProperties(prev => [...prev, {
      id: generateId(),
      name: newName.trim(),
      type: newType,
      color: newColor,
      options: newType === "select" || newType === "multiselect" ? [] : undefined,
    }]);
    setNewName("");
  };

  return (
    <Modal onClose={onClose}>
      <div style={{ padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, color: "#2d2520" }}>Manage Properties</h2>
          <button onClick={onClose} style={{ color: "#b0a898", background: "none", border: "none", cursor: "pointer", padding: 4 }}><IconX size={16} /></button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
          {properties.map((prop, i) => (
            <div key={prop.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: 10, borderRadius: 8, background: "#fff", border: "1px solid #e5dfd7" }}>
              <ColorDot color={prop.color} size={9} />
              <input
                value={prop.name}
                onChange={e => setProperties(prev => prev.map(p => p.id === prop.id ? { ...p, name: e.target.value } : p))}
                style={{ flex: 1, border: "none", background: "transparent", fontSize: 13, color: "#2d2520", outline: "none", fontWeight: 500 }}
              />
              <PropertyTypeBadge type={prop.type} />
              {i > 0
                ? <button onClick={() => setProperties(prev => prev.filter(p => p.id !== prop.id))}
                    style={{ color: "#d5cdc3", background: "none", border: "none", cursor: "pointer", padding: 2, display: "flex" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#b55a5a"} onMouseLeave={e => e.currentTarget.style.color = "#d5cdc3"}>
                    <IconX size={13} />
                  </button>
                : <span style={{ width: 17 }} />
              }
            </div>
          ))}
        </div>

        <div style={{ border: "1.5px dashed #d5cdc3", borderRadius: 10, padding: 14, background: "#fdfcfa" }}>
          <p style={{ fontSize: 11, color: "#8a7d70", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, marginBottom: 10 }}>Add Property</p>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <input value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === "Enter" && addProp()} placeholder="Name"
              style={{ flex: 1, border: "1.5px solid #e5dfd7", borderRadius: 8, padding: "7px 10px", fontSize: 13, color: "#2d2520", outline: "none", background: "#fff" }} />
            <select value={newType} onChange={e => setNewType(e.target.value as PropertyType)}
              style={{ border: "1.5px solid #e5dfd7", borderRadius: 8, padding: "7px 8px", fontSize: 12, color: "#2d2520", outline: "none", background: "#fff" }}>
              {PROPERTY_TYPES.map(t => <option key={t} value={t}>{PROPERTY_TYPE_LABELS[t]}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, color: "#b0a898" }}>Color</span>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {TABLE_COLORS.map(c => (
                <button key={c} onClick={() => setNewColor(c)}
                  style={{ width: 18, height: 18, borderRadius: "50%", background: c, border: "none", cursor: "pointer", outline: newColor === c ? `2.5px solid ${c}` : "none", outlineOffset: 2 }} />
              ))}
            </div>
          </div>
          <button onClick={addProp} style={{ width: "100%", background: "#2d2520", color: "#fff", border: "none", borderRadius: 8, padding: 9, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            + Add Property
          </button>
        </div>

        <button onClick={() => { onSave(properties); onClose(); }}
          style={{ width: "100%", marginTop: 14, background: table.color, color: "#fff", border: "none", borderRadius: 10, padding: 12, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
          Save Changes
        </button>
      </div>
    </Modal>
  );
};