import { PROPERTY_TYPE_META, PROPERTY_TYPE_LABELS } from "../../constants";
import type { PropertyType } from "../../types";

export const PropertyTypeBadge = ({ type }: { type: PropertyType }) => {
  const m = PROPERTY_TYPE_META[type];
  return (
    <span style={{ background: m.bg, color: m.text, fontSize: 10, fontFamily: "monospace", fontWeight: 700, padding: "1px 6px", borderRadius: 4, letterSpacing: "0.04em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
      {PROPERTY_TYPE_LABELS[type]}
    </span>
  );
};
