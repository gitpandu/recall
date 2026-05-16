export const Modal = ({ onClose, children }: { onClose: () => void; children: React.ReactNode }) => (
  <div
    onClick={onClose}
    style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "flex-end", justifyContent: "center", background: "rgba(50,40,30,0.35)", backdropFilter: "blur(3px)" }}
  >
    <div
      onClick={e => e.stopPropagation()}
      style={{ width: "100%", maxWidth: 512, background: "#faf8f5", maxHeight: "92vh", overflowY: "auto", boxShadow: "0 24px 64px rgba(0,0,0,0.14)", borderRadius: "1rem 1rem 0 0" }}
    >
      {children}
    </div>
  </div>
);