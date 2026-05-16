export const ColorDot = ({ color, size = 10 }: { color: string; size?: number }) => (
  <span style={{ background: color, width: size, height: size, borderRadius: "50%", display: "inline-block", flexShrink: 0 }} />
);