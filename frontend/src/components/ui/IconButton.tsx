export const IconButton = ({ onClick, active = false, activeColor = "#c0764a", children, title }: {
  onClick: () => void;
  active?: boolean;
  activeColor?: string;
  children: React.ReactNode;
  title?: string;
}) => (
  <button
    onClick={onClick}
    title={title}
    style={{ background: "none", border: `1.5px solid ${active ? activeColor : "#e5dfd7"}`, borderRadius: 8, padding: "7px 9px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: active ? activeColor : "#8a7d70", transition: "border-color 0.15s, color 0.15s" }}
    onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = activeColor; e.currentTarget.style.color = activeColor; } }}
    onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = "#e5dfd7"; e.currentTarget.style.color = "#8a7d70"; } }}
  >
    {children}
  </button>
);