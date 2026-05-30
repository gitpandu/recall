import { useState, useCallback, type ChangeEvent } from "react";
import { Modal } from "../../components/ui/Modal";
import { ColorDot } from "../../components/ui/ColorDot";
import { PropertyTypeBadge } from "../../components/ui/PropertyTypeBadge";
import { IconX, IconPaperclip } from "../../components/ui/icons";
import type { Table, Row, Attachment } from "../../types";

const formatTimestamp = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("id-ID", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const RowModal = ({ table, row, onClose, onSave, onUploadAttachment, onDeleteAttachment, onDeleteRow }: {
  table: Table;
  row: Row | null;
  onClose: () => void;
  onSave: (values: Record<string, unknown>) => void;
  onUploadAttachment: (rowId: string, file: File) => Promise<Attachment>;
  onDeleteAttachment: (rowId: string, attachmentId: string) => Promise<void>;
  onDeleteRow?: () => void;
}) => {
  const [values, setValues] = useState<Record<string, unknown>>(() => {
    const init: Record<string, unknown> = {};
    table.properties.forEach(p => {
      init[p.id] = row ? row.values[p.id] : (p.type === "checkbox" ? false : "");
    });
    return init;
  });
  const [attachments, setAttachments] = useState<Attachment[]>(row?.attachments ?? []);
  const [uploading, setUploading] = useState(false);
  const [attachmentError, setAttachmentError] = useState<string | null>(null);
  const set = useCallback((id: string, val: unknown) => setValues(prev => ({ ...prev, [id]: val })), []);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.currentTarget.value = "";
    if (!file || !row) return;
    try {
      setAttachmentError(null);
      setUploading(true);
      const uploaded = await onUploadAttachment(row.id, file);
      setAttachments(prev => [...prev, uploaded]);
    } catch (err) {
      setAttachmentError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAttachment = async (attachmentId: string) => {
    if (!row) return;
    const attachment = attachments.find(x => x.id === attachmentId);
    const name = attachment ? attachment.name : "this attachment";
    const ok = window.confirm(`Delete attachment "${name}"?`);
    if (!ok) return;
    try {
      setAttachmentError(null);
      await onDeleteAttachment(row.id, attachmentId);
      setAttachments(prev => prev.filter(x => x.id !== attachmentId));
    } catch (err) {
      setAttachmentError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const inputSt = (): React.CSSProperties => ({
    width: "100%", border: "1.5px solid #e5dfd7", borderRadius: 10,
    padding: "10px 14px", fontSize: 14, color: "#2d2520", outline: "none",
    background: "#fff", fontFamily: "inherit", transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
  });

  return (
    <Modal onClose={onClose}>
      <div style={{ padding: 28 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ColorDot color={table.color} size={14} />
            <h2 style={{ fontSize: 24, fontWeight: 700, color: "#2d2520", margin: 0 }}>{row ? "Edit Row" : "New Row"}</h2>
          </div>
          <button onClick={onClose}
            style={{ color: "#b0a898", background: "#f5f2ee", border: "none", cursor: "pointer", padding: 8, borderRadius: "50%", display: "flex", transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#e5dfd7"; e.currentTarget.style.color = "#2d2520"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#f5f2ee"; e.currentTarget.style.color = "#b0a898"; }}>
            <IconX size={14} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {table.properties.map(prop => (
            <div key={prop.id}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, fontSize: 11, color: "#8a7d70", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>
                <ColorDot color={prop.color} size={7} />
                {prop.name}
                <PropertyTypeBadge type={prop.type} />
              </label>

              {prop.type === "text" && (
                <input value={String(values[prop.id] ?? "")} onChange={e => set(prop.id, e.target.value)} style={inputSt()}
                  onFocus={e => e.currentTarget.style.borderColor = prop.color} onBlur={e => e.currentTarget.style.borderColor = "#e5dfd7"} />
              )}
              {prop.type === "longtext" && (
                <textarea value={String(values[prop.id] ?? "")} onChange={e => set(prop.id, e.target.value)} rows={3}
                  style={{ ...inputSt(), resize: "none" }}
                  onFocus={e => e.currentTarget.style.borderColor = prop.color} onBlur={e => e.currentTarget.style.borderColor = "#e5dfd7"} />
              )}
              {(prop.type === "number" || prop.type === "currency_idr") && (
                <div style={{ position: "relative" }}>
                  {prop.type === "currency_idr" && (
                    <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: "#8a7d70", pointerEvents: "none" }}>Rp</span>
                  )}
                  <input type="number" value={String(values[prop.id] ?? "")}
                    onChange={e => set(prop.id, e.target.value === "" ? "" : Number(e.target.value))}
                    style={{ ...inputSt(), paddingLeft: prop.type === "currency_idr" ? 32 : 12 }}
                    onFocus={e => e.currentTarget.style.borderColor = prop.color} onBlur={e => e.currentTarget.style.borderColor = "#e5dfd7"} />
                </div>
              )}
              {prop.type === "date" && (
                <input type="date" value={String(values[prop.id] ?? "")} onChange={e => set(prop.id, e.target.value)} style={inputSt()}
                  onFocus={e => e.currentTarget.style.borderColor = prop.color} onBlur={e => e.currentTarget.style.borderColor = "#e5dfd7"} />
              )}
              {prop.type === "checkbox" && (
                <button onClick={() => set(prop.id, !values[prop.id])}
                  style={{ width: 48, height: 28, borderRadius: 14, border: "none", cursor: "pointer", background: values[prop.id] ? prop.color : "#e5dfd7", transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)", position: "relative", boxShadow: values[prop.id] ? `0 2px 8px ${prop.color}40` : "none" }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#fff", position: "absolute", top: 4, transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)", left: values[prop.id] ? 24 : 4, boxShadow: "0 2px 4px rgba(0,0,0,0.2)" }} />
                </button>
              )}
              {prop.type === "select" && (
                <select value={String(values[prop.id] ?? "")} onChange={e => set(prop.id, e.target.value)} style={{ ...inputSt(), appearance: "auto" } as React.CSSProperties}
                  onFocus={e => e.currentTarget.style.borderColor = prop.color} onBlur={e => e.currentTarget.style.borderColor = "#e5dfd7"}>
                  <option value="">— select —</option>
                  {(prop.options ?? []).map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              )}
              {prop.type === "multiselect" && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {(prop.options ?? []).map(o => {
                    const selected = Array.isArray(values[prop.id]) && (values[prop.id] as string[]).includes(o);
                    return (
                      <button key={o} onClick={() => {
                        const cur = Array.isArray(values[prop.id]) ? (values[prop.id] as string[]) : [];
                        set(prop.id, selected ? cur.filter(x => x !== o) : [...cur, o]);
                      }}
                        style={{ padding: "4px 12px", borderRadius: 20, border: "1.5px solid", borderColor: selected ? prop.color : "#e5dfd7", background: selected ? prop.color + "1a" : "#fff", color: selected ? prop.color : "#8a7d70", fontSize: 12, fontWeight: selected ? 600 : 400, cursor: "pointer" }}>
                        {o}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}

          {row && (
            <div>
              <label style={{ fontSize: 11, color: "#8a7d70", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, display: "block", marginBottom: 8 }}>
                Attachments {attachments.length > 0 && `(${attachments.length})`}
              </label>
              {attachments.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 8 }}>
                  {attachments.map(a => (
                    <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 8, background: "#fff", border: "1px solid #e5dfd7" }}>
                      <span style={{ color: "#b0a898" }}><IconPaperclip size={13} /></span>
                      <span style={{ fontSize: 13, color: "#3d3028", flex: 1 }}>{a.name}</span>
                      <button onClick={() => { void handleDeleteAttachment(a.id); }}
                        style={{ color: "#d5cdc3", background: "none", border: "none", cursor: "pointer", display: "flex" }}
                        onMouseEnter={e => e.currentTarget.style.color = "#b55a5a"} onMouseLeave={e => e.currentTarget.style.color = "#d5cdc3"}>
                        <IconX size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <label style={{ display: "block", width: "100%", border: "1.5px dashed #d5cdc3", borderRadius: 8, padding: 10, textAlign: "center", color: "#8a7d70", fontSize: 13, cursor: uploading ? "default" : "pointer", opacity: uploading ? 0.6 : 1 }}>
                {uploading ? "Uploading..." : "+ Add attachment"}
                <input type="file" onChange={(e) => { void handleFileChange(e); }} disabled={uploading} style={{ display: "none" }} />
              </label>
              {attachmentError && (
                <div style={{ marginTop: 8, fontSize: 12, color: "#b55a5a" }}>{attachmentError}</div>
              )}
            </div>
          )}

          {row && (
            <div style={{ background: "#fff", border: "1px solid #e5dfd7", borderRadius: 8, padding: "10px 12px", display: "grid", gap: 6 }}>
              <div style={{ fontSize: 11, color: "#8a7d70", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>
                Metadata
              </div>
              <div style={{ fontSize: 12, color: "#6a5d50" }}>Row ID: {row.id}</div>
              <div style={{ fontSize: 12, color: "#6a5d50" }}>Table: {table.name} (ID: {table.id})</div>
              <div style={{ fontSize: 12, color: "#6a5d50" }}>Created: {formatTimestamp(row.createdAt)}</div>
              <div style={{ fontSize: 12, color: "#6a5d50" }}>Updated: {formatTimestamp(row.updatedAt)}</div>
            </div>
          )}
        </div>

        <button onClick={() => { onSave(values); onClose(); }}
          style={{ width: "100%", marginTop: 28, background: table.color, color: "#fff", border: "none", borderRadius: 12, padding: "14px 20px", fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: `0 4px 12px ${table.color}40`, transition: "all 0.15s" }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = `0 6px 16px ${table.color}55`; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 4px 12px ${table.color}40`; }}>
          Save Row
        </button>

        {row && onDeleteRow && (
          <button onClick={onDeleteRow}
            style={{ width: "100%", marginTop: 12, background: "#fff", color: "#b55a5a", border: "1.5px solid #e8c9c9", borderRadius: 12, padding: "14px 20px", fontSize: 15, fontWeight: 700, cursor: "pointer", transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#fdf4f4"; e.currentTarget.style.borderColor = "#dfa9a9"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#e8c9c9"; }}>
            Delete Row
          </button>
        )}
      </div>
    </Modal>
  );
};
