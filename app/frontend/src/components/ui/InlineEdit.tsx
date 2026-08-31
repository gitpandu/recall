import { useState, useRef, useEffect } from "react";

export const InlineEdit = ({ value, onChange, placeholder, style, multiline = false }: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  style?: React.CSSProperties;
  multiline?: boolean;
}) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef<HTMLInputElement & HTMLTextAreaElement>(null);

  useEffect(() => { if (editing) ref.current?.focus(); }, [editing]);

  const commit = () => { onChange(draft.trim() || value); setEditing(false); };

  const shared = {
    ref,
    value: draft,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDraft(e.target.value),
    onBlur: commit,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !multiline) commit();
      if (e.key === "Escape") { setDraft(value); setEditing(false); }
    },
    style: { ...style, background: "transparent", outline: "none", border: "none", borderBottom: "1.5px solid #c0a882", width: "100%", fontFamily: "inherit" },
  };

  if (editing) {
    return multiline
      ? <textarea {...shared} rows={2} style={{ ...shared.style, resize: "none" }} />
      : <input {...shared} />;
  }

  return (
    <span
      onClick={() => { setDraft(value); setEditing(true); }}
      style={{ ...style, cursor: "text", borderBottom: "1.5px dashed transparent", display: "block" }}
      title="Click to edit"
    >
      {value || <span style={{ opacity: 0.35 }}>{placeholder}</span>}
    </span>
  );
};