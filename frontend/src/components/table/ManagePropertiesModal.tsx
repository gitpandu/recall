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
      <div style={{ padding: 28 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: "#2d2520", margin: 0 }}>Manage Properties</h2>
          <button onClick={onClose}
            style={{ color: "#b0a898", background: "#f5f2ee", border: "none", cursor: "pointer", padding: 8, borderRadius: "50%", display: "flex", transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#e5dfd7"; e.currentTarget.style.color = "#2d2520"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#f5f2ee"; e.currentTarget.style.color = "#b0a898"; }}>
            <IconX size={14} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
          {properties.map((prop, i) => (
            <div key={prop.id} style={{ display: "flex", flexDirection: "column", padding: 10, borderRadius: 8, background: "#fff", border: "1px solid #e5dfd7" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
              {(prop.type === "select" || prop.type === "multiselect") && (
                <div style={{ paddingLeft: 17, paddingTop: 8, display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {prop.options?.map(opt => (
                    <span key={opt} style={{ fontSize: 11, background: prop.color + "1a", border: `1px solid ${prop.color}40`, color: prop.color, padding: "2px 6px", borderRadius: 4, display: "flex", alignItems: "center", gap: 4, fontWeight: 500 }}>
                      {opt}
                      <button
                        onClick={() => setProperties(prev => prev.map(p => p.id === prop.id ? { ...p, options: p.options?.filter(o => o !== opt) } : p))}
                        style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: prop.color, display: "flex", alignItems: "center", opacity: 0.7 }}
                        onMouseEnter={e => e.currentTarget.style.opacity = "1"}
                        onMouseLeave={e => e.currentTarget.style.opacity = "0.7"}
                      >
                        <IconX size={10} />
                      </button>
                    </span>
                  ))}
                  <input
                    placeholder="Add option... (Enter)"
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const val = e.currentTarget.value.trim();
                        if (val && !prop.options?.includes(val)) {
                          setProperties(prev => prev.map(p => p.id === prop.id ? { ...p, options: [...(p.options || []), val] } : p));
                        }
                        e.currentTarget.value = "";
                      }
                    }}
                    style={{ border: "1px dashed #d5cdc3", borderRadius: 4, padding: "2px 6px", fontSize: 11, outline: "none", minWidth: 120, background: "transparent", color: "#6a5d50" }}
                    onFocus={e => e.currentTarget.style.borderColor = prop.color}
                    onBlur={e => e.currentTarget.style.borderColor = "#d5cdc3"}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ border: "1.5px dashed #d5cdc3", borderRadius: 12, padding: 16, background: "#faf8f5" }}>
          <p style={{ fontSize: 11, color: "#8a7d70", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, marginBottom: 12 }}>Add Property</p>
          <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
            <input value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === "Enter" && addProp()} placeholder="Name"
              style={{ flex: 1, border: "1.5px solid #e5dfd7", borderRadius: 8, padding: "10px 12px", fontSize: 13, color: "#2d2520", outline: "none", background: "#fff", transition: "all 0.15s" }}
              onFocus={e => { e.currentTarget.style.borderColor = newColor; e.currentTarget.style.boxShadow = `0 0 0 3px ${newColor}1a`; }}
              onBlur={e => { e.currentTarget.style.borderColor = "#e5dfd7"; e.currentTarget.style.boxShadow = "none"; }} />
            <select value={newType} onChange={e => setNewType(e.target.value as PropertyType)}
              style={{ border: "1.5px solid #e5dfd7", borderRadius: 8, padding: "10px", fontSize: 13, color: "#2d2520", outline: "none", background: "#fff" }}>
              {PROPERTY_TYPES.map(t => <option key={t} value={t}>{PROPERTY_TYPE_LABELS[t]}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, color: "#b0a898", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Color</span>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginLeft: 4 }}>
              {TABLE_COLORS.map(c => (
                <button key={c} onClick={() => setNewColor(c)}
                  style={{ width: 22, height: 22, borderRadius: "50%", background: c, border: "none", cursor: "pointer", outline: newColor === c ? `3px solid ${c}` : "none", outlineOffset: 2 }} />
              ))}
            </div>
          </div>
          <button onClick={addProp}
            style={{ width: "100%", background: "#2d2520", color: "#fff", border: "none", borderRadius: 8, padding: "10px 12px", fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "background 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.background = "#1a1512"}
            onMouseLeave={e => e.currentTarget.style.background = "#2d2520"}>
            + Add Property
          </button>
        </div>

        <button onClick={() => { onSave(properties); onClose(); }}
          style={{ width: "100%", marginTop: 24, background: table.color, color: "#fff", border: "none", borderRadius: 12, padding: "14px 20px", fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: `0 4px 12px ${table.color}40`, transition: "all 0.15s" }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = `0 6px 16px ${table.color}55`; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 4px 12px ${table.color}40`; }}>
          Save Changes
        </button>
      </div>
    </Modal>
  );
};