import { Modal } from "../../components/ui/Modal";
import { IconX, IconPaperclip } from "../../components/ui/icons";
import type { Attachment } from "../../types";

export const AttachmentGallery = ({ attachments, onClose }: { attachments: Attachment[]; onClose: () => void }) => (
  <Modal onClose={onClose}>
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, color: "#2d2520" }}>
          Attachments ({attachments.length})
        </h2>
        <button onClick={onClose} style={{ color: "#b0a898", background: "none", border: "none", cursor: "pointer", padding: 4 }}>
          <IconX size={16} />
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {attachments.map(a => (
          <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, borderRadius: 8, background: "#fff", border: "1px solid #e5dfd7" }}>
            <span style={{ color: "#b0a898", flexShrink: 0 }}><IconPaperclip size={16} /></span>
            <span style={{ fontSize: 13, color: "#3d3028", flex: 1 }}>{a.name}</span>
            <a href={a.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: "#4a7fb5", textDecoration: "none" }}>View</a>
          </div>
        ))}
      </div>
      <div style={{ border: "1.5px dashed #d5cdc3", borderRadius: 8, padding: 14, textAlign: "center", color: "#b0a898", fontSize: 13, marginTop: 12 }}>
        + Add attachment
      </div>
    </div>
  </Modal>
);