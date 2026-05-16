import { useMemo, useState } from "react";
import { Modal } from "../../components/ui/Modal";
import { IconX, IconPaperclip } from "../../components/ui/icons";
import type { Attachment } from "../../types";

const getExtension = (attachment: Attachment): string => {
  const source = (attachment.name || attachment.url).toLowerCase();
  const ext = source.split(".").pop() ?? "";
  return ext.split("?")[0];
};

const getMediaKind = (attachment: Attachment): "image" | "video" | "audio" | "pdf" | "other" => {
  const ext = getExtension(attachment);
  if (["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"].includes(ext)) return "image";
  if (["mp4", "webm", "ogg", "mov"].includes(ext)) return "video";
  if (["mp3", "wav", "ogg", "m4a", "aac", "flac"].includes(ext)) return "audio";
  if (ext === "pdf") return "pdf";
  return "other";
};

export const AttachmentGallery = ({ attachments, onClose }: { attachments: Attachment[]; onClose: () => void }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const selected = useMemo(() => attachments.find(a => a.id === selectedId) ?? null, [attachments, selectedId]);
  const kind = selected ? getMediaKind(selected) : "other";

  const closeLightbox = () => {
    setSelectedId(null);
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setDragging(false);
  };

  return (
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
          {attachments.map(a => {
            const previewable = getMediaKind(a) !== "other";
            return (
              <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, borderRadius: 8, background: "#fff", border: "1px solid #e5dfd7" }}>
                <span style={{ color: "#b0a898", flexShrink: 0 }}><IconPaperclip size={16} /></span>
                <span style={{ fontSize: 13, color: "#3d3028", flex: 1 }}>{a.name}</span>
                {previewable ? (
                  <button onClick={() => { setSelectedId(a.id); setZoom(1); setPan({ x: 0, y: 0 }); }} style={{ fontSize: 11, color: "#4a7fb5", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                    Preview
                  </button>
                ) : (
                  <a href={a.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: "#4a7fb5", textDecoration: "none" }}>Open</a>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {selected && (
        <div
          onClick={closeLightbox}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 120, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ width: "min(1000px, 96vw)", maxHeight: "90vh", background: "#111", borderRadius: 10, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", color: "#fff", borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
              <div style={{ fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginRight: 12 }}>{selected.name}</div>
              <button onClick={closeLightbox} style={{ color: "#fff", background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                <IconX size={16} />
              </button>
            </div>
            <div style={{ padding: 12, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 300 }}>
              {kind === "image" && (
                <div
                  onWheel={(e) => {
                    e.preventDefault();
                    const delta = e.deltaY > 0 ? -0.15 : 0.15;
                    setZoom(prev => Math.min(5, Math.max(1, Number((prev + delta).toFixed(2)))));
                  }}
                  onMouseDown={(e) => {
                    if (zoom <= 1) return;
                    setDragging(true);
                    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
                  }}
                  onMouseMove={(e) => {
                    if (!dragging || zoom <= 1) return;
                    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
                  }}
                  onMouseUp={() => setDragging(false)}
                  onMouseLeave={() => setDragging(false)}
                  style={{ width: "100%", height: "76vh", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", cursor: zoom > 1 ? (dragging ? "grabbing" : "grab") : "zoom-in" }}
                >
                  <img
                    src={selected.url}
                    alt={selected.name}
                    style={{ maxWidth: "100%", maxHeight: "76vh", objectFit: "contain", transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: "center center", userSelect: "none", pointerEvents: "none" }}
                  />
                </div>
              )}
              {kind === "video" && <video src={selected.url} controls style={{ maxWidth: "100%", maxHeight: "76vh" }} />}
              {kind === "audio" && <audio src={selected.url} controls style={{ width: "min(700px, 90vw)" }} />}
              {kind === "pdf" && <iframe src={selected.url} title={selected.name} style={{ width: "100%", height: "76vh", border: "none", background: "#fff" }} />}
            </div>
            {kind === "image" && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "0 0 12px", color: "#ddd", fontSize: 12 }}>
                <button onClick={() => setZoom(z => Math.max(1, Number((z - 0.25).toFixed(2))))} style={{ border: "1px solid #555", borderRadius: 6, background: "#222", color: "#fff", padding: "4px 8px", cursor: "pointer" }}>-</button>
                <span>{Math.round(zoom * 100)}%</span>
                <button onClick={() => setZoom(z => Math.min(5, Number((z + 0.25).toFixed(2))))} style={{ border: "1px solid #555", borderRadius: 6, background: "#222", color: "#fff", padding: "4px 8px", cursor: "pointer" }}>+</button>
                <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} style={{ border: "1px solid #555", borderRadius: 6, background: "#222", color: "#fff", padding: "4px 8px", cursor: "pointer" }}>Reset</button>
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};
