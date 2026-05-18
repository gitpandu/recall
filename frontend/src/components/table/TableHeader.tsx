import { useRef, useEffect, useState } from "react";
import { ColorDot } from "../../components/ui/ColorDot";
import { IconButton } from "../../components/ui/IconButton";
import { IconSearch, IconSliders, IconFilter, IconX, IconSort } from "../../components/ui/icons";
import type { Table } from "../../types";

export const TableHeader = ({ table, search, searchOpen, filtersOpen, activeFilterCount, sortPropId, sortDir, onSearchChange, onToggleSearch, onToggleFilters, onManageProps, onSort }: {
  table: Table;
  search: string;
  searchOpen: boolean;
  filtersOpen: boolean;
  activeFilterCount: number;
  sortPropId: string | null;
  sortDir: "asc" | "desc";
  onSearchChange: (v: string) => void;
  onToggleSearch: () => void;
  onToggleFilters: () => void;
  onManageProps: () => void;
  onSort: (propId: string | null, dir?: "asc" | "desc") => void;
}) => {
  const [sortOpen, setSortOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => { if (searchOpen) searchRef.current?.focus(); }, [searchOpen]);

  return (
    <div style={{ position: "sticky", top: 0, zIndex: 10, background: "#faf8f5", borderBottom: "1px solid #e5dfd7" }}>
      <div style={{ padding: "12px 16px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <ColorDot color={table.color} size={9} />
              <span style={{ fontSize: 15, fontWeight: 700, color: "#2d2520" }}>{table.name}</span>
            </div>
            <div style={{ marginLeft: 17 }}>
              <span style={{ fontSize: 12, color: "#a09080" }}>{table.description || "Add a description..."}</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0, marginTop: 2 }}>
            <IconButton onClick={() => { onToggleSearch(); setSortOpen(false); }} active={searchOpen} activeColor={table.color} title="Search">
              <IconSearch size={15} />
            </IconButton>
            <IconButton onClick={() => { onToggleFilters(); setSortOpen(false); }} active={filtersOpen || activeFilterCount > 0} activeColor={table.color} title="Filters">
              <IconFilter size={15} />
            </IconButton>
            <div style={{ position: "relative" }}>
              <IconButton onClick={() => { setSortOpen(o => !o); }} active={sortOpen || Boolean(sortPropId)} activeColor={table.color} title="Sort records">
                <IconSort size={15} />
              </IconButton>
              {sortOpen && (
                <div style={{ position: "absolute", right: 0, top: "calc(100% + 6px)", background: "#fff", border: "1px solid #e5dfd7", borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.1)", zIndex: 20, minWidth: 200, padding: 8, maxHeight: 300, overflowY: "auto" }}>
                  <div style={{ padding: "4px 8px 8px", fontSize: 11, fontWeight: 700, color: "#8a7d70", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #f0ebe4", marginBottom: 6 }}>
                    Sort by
                  </div>
                  {table.properties.map(prop => {
                    const isSortedAsc = sortPropId === prop.id && sortDir === "asc";
                    const isSortedDesc = sortPropId === prop.id && sortDir === "desc";
                    return (
                      <div key={prop.id} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 4, alignItems: "center", padding: "2px 0" }}>
                        <span style={{ fontSize: 13, color: "#3d3028", paddingLeft: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{prop.name}</span>
                        <button onClick={() => { onSort(prop.id, "asc"); setSortOpen(false); }}
                          style={{ border: "none", background: isSortedAsc ? `${prop.color}22` : "none", color: isSortedAsc ? prop.color : "#8a7d70", borderRadius: 6, padding: "4px 8px", fontSize: 11, cursor: "pointer", fontWeight: isSortedAsc ? 600 : 400 }}
                          onMouseEnter={e => { if (!isSortedAsc) e.currentTarget.style.background = "#f5f2ee"; }}
                          onMouseLeave={e => { if (!isSortedAsc) e.currentTarget.style.background = "none"; }}>
                          ASC
                        </button>
                        <button onClick={() => { onSort(prop.id, "desc"); setSortOpen(false); }}
                          style={{ border: "none", background: isSortedDesc ? `${prop.color}22` : "none", color: isSortedDesc ? prop.color : "#8a7d70", borderRadius: 6, padding: "4px 8px", fontSize: 11, cursor: "pointer", fontWeight: isSortedDesc ? 600 : 400 }}
                          onMouseEnter={e => { if (!isSortedDesc) e.currentTarget.style.background = "#f5f2ee"; }}
                          onMouseLeave={e => { if (!isSortedDesc) e.currentTarget.style.background = "none"; }}>
                          DESC
                        </button>
                      </div>
                    );
                  })}
                  {sortPropId && (
                    <button onClick={() => { onSort(null); setSortOpen(false); }}
                      style={{ marginTop: 8, width: "100%", border: "1px solid #e5dfd7", borderRadius: 8, background: "#faf8f5", fontSize: 12, color: "#b55a5a", padding: "6px 8px", cursor: "pointer", fontWeight: 500 }}
                      onMouseEnter={e => e.currentTarget.style.background = "#fdf4f4"}
                      onMouseLeave={e => e.currentTarget.style.background = "#faf8f5"}>
                      Clear Sort
                    </button>
                  )}
                </div>
              )}
            </div>
            <IconButton onClick={() => { onManageProps(); setSortOpen(false); }} activeColor={table.color} title="Manage properties">
              <IconSliders size={15} />
            </IconButton>
          </div>
        </div>

        {searchOpen && (
          <div style={{ position: "relative", marginTop: 10 }}>
            <input ref={searchRef} value={search} onChange={e => onSearchChange(e.target.value)} placeholder="Search records..."
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
