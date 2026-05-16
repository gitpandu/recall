import { useRef, useEffect } from "react";
import { ColorDot } from "../../components/ui/ColorDot";
import { IconButton } from "../../components/ui/IconButton";
import { InlineEdit } from "../../components/ui/InlineEdit";
import { IconSearch, IconSliders, IconX } from "../../components/ui/icons";
import type { Table } from "../../types";

export const TableHeader = ({ table, search, searchOpen, onUpdateTable, onSearchChange, onToggleSearch, onManageProps }: {
  table: Table;
  search: string;
  searchOpen: boolean;
  onUpdateTable: (t: Table) => void;
  onSearchChange: (v: string) => void;
  onToggleSearch: () => void;
  onManageProps: () => void;
}) => {
  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => { if (searchOpen) searchRef.current?.focus(); }, [searchOpen]);

  return (
    <div style={{ position: "sticky", top: 0, zIndex: 10, background: "#faf8f5", borderBottom: "1px solid #e5dfd7" }}>
      <div style={{ padding: "12px 16px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <ColorDot color={table.color} size={9} />
              <InlineEdit value={table.name} onChange={name => onUpdateTable({ ...table, name })} placeholder="Table name"
                style={{ fontSize: 15, fontWeight: 700, color: "#2d2520" }} />
            </div>
            <div style={{ marginLeft: 17 }}>
              <InlineEdit value={table.description} onChange={description => onUpdateTable({ ...table, description })} placeholder="Add a description…"
                style={{ fontSize: 12, color: "#a09080" }} multiline />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0, marginTop: 2 }}>
            <span style={{ fontSize: 11, color: "#b0a898" }}>{table.rowCount} rows</span>
            <IconButton onClick={onToggleSearch} active={searchOpen} activeColor={table.color} title="Search">
              <IconSearch size={15} />
            </IconButton>
            <IconButton onClick={onManageProps} activeColor={table.color} title="Manage properties">
              <IconSliders size={15} />
            </IconButton>
          </div>
        </div>

        {searchOpen && (
          <div style={{ position: "relative", marginTop: 10 }}>
            <input ref={searchRef} value={search} onChange={e => onSearchChange(e.target.value)} placeholder="Search records…"
              style={{ width: "100%", border: "1.5px solid #e5dfd7", borderRadius: 8, padding: "7px 32px 7px 12px", fontSize: 13, color: "#2d2520", outline: "none", background: "#fff", boxSizing: "border-box" }}
              onFocus={e => e.currentTarget.style.borderColor = table.color} onBlur={e => e.currentTarget.style.borderColor = "#e5dfd7"} />
            {search && (
              <button onClick={() => onSearchChange("")}
                style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#b0a898", display: "flex" }}>
                <IconX size={13} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};