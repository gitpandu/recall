import { useState, useMemo, useRef, useEffect } from "react";
import { TableCard } from "./TableCard";
import { IconButton } from "../../components/ui/IconButton";
import { IconSearch, IconSort, IconX } from "../../components/ui/icons";
import type { Table } from "../../types";

type SortOption = "recent" | "name_asc" | "name_desc" | "rows_asc" | "rows_desc";

const sortLabels: Record<SortOption, string> = {
  recent: "Recently added",
  name_asc: "Name A–Z",
  name_desc: "Name Z–A",
  rows_asc: "Fewest rows",
  rows_desc: "Most rows",
};

export const HomePage = ({ tables, onSelectTable, onCreateTable }: {
  tables: Table[];
  onSelectTable: (t: Table) => void;
  onCreateTable: () => void;
}) => {
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [sort, setSort] = useState<SortOption>("recent");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (searchOpen) searchRef.current?.focus(); }, [searchOpen]);

  const filtered = useMemo(() => {
    let t = tables;
    if (search.trim()) {
      const q = search.toLowerCase();
      t = t.filter(tbl => tbl.name.toLowerCase().includes(q) || tbl.description.toLowerCase().includes(q));
    }
    return [...t].sort((a, b) => {
      if (sort === "name_asc") return a.name.localeCompare(b.name);
      if (sort === "name_desc") return b.name.localeCompare(a.name);
      if (sort === "rows_asc") return a.rowCount - b.rowCount;
      if (sort === "rows_desc") return b.rowCount - a.rowCount;
      return 0;
    });
  }, [tables, search, sort]);

  return (
    <div style={{ minHeight: "100vh", background: "#f5f2ee", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ background: "#faf8f5", borderBottom: "1px solid #e5dfd7", padding: "32px 20px 16px" }}>
        <p style={{ fontSize: 11, color: "#b0a898", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, marginBottom: 4 }}>Personal Logger</p>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12 }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#2d2520", fontWeight: 700, margin: 0 }}>Recall</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <IconButton
              onClick={() => { setSearchOpen(o => !o); if (searchOpen) setSearch(""); setSortOpen(false); }}
              active={searchOpen} activeColor="#c0764a" title="Search tables">
              <IconSearch size={15} />
            </IconButton>
            <div style={{ position: "relative" }}>
              <IconButton
                onClick={() => { setSortOpen(o => !o); setSearchOpen(false); }}
                active={sortOpen || sort !== "recent"} activeColor="#c0764a" title="Sort tables">
                <IconSort size={15} />
              </IconButton>
              {sortOpen && (
                <div style={{ position: "absolute", right: 0, top: "calc(100% + 6px)", background: "#fff", border: "1px solid #e5dfd7", borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.1)", zIndex: 20, minWidth: 170, overflow: "hidden" }}>
                  {(Object.entries(sortLabels) as [SortOption, string][]).map(([key, label]) => (
                    <button key={key} onClick={() => { setSort(key); setSortOpen(false); }}
                      style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 14px", fontSize: 13, color: sort === key ? "#c0764a" : "#3d3028", background: sort === key ? "#fdf4ee" : "none", border: "none", cursor: "pointer", fontWeight: sort === key ? 600 : 400 }}>
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        {searchOpen && (
          <div style={{ position: "relative", marginTop: 12 }}>
            <input ref={searchRef} value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tables…"
              style={{ width: "100%", border: "1.5px solid #e5dfd7", borderRadius: 8, padding: "8px 32px 8px 12px", fontSize: 13, color: "#2d2520", outline: "none", background: "#fff", boxSizing: "border-box" }}
              onFocus={e => e.currentTarget.style.borderColor = "#c0764a"} onBlur={e => e.currentTarget.style.borderColor = "#e5dfd7"} />
            {search && (
              <button onClick={() => setSearch("")}
                style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#b0a898", display: "flex" }}>
                <IconX size={13} />
              </button>
            )}
          </div>
        )}
      </div>

      <div style={{ padding: "10px 20px 2px", display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 11, color: "#b0a898" }}>{filtered.length} table{filtered.length !== 1 ? "s" : ""}</span>
        <span style={{ fontSize: 11, color: "#b0a898" }}>{sortLabels[sort]}</span>
      </div>

      <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.length === 0 && (
          <div style={{ padding: "40px 0", textAlign: "center", color: "#b0a898", fontSize: 13 }}>
            {search.trim() ? "No tables match your search" : "No tables yet. Create your first table."}
          </div>
        )}
        {filtered.map(table => (
          <TableCard key={table.id} table={table} onClick={() => onSelectTable(table)} />
        ))}
        <button onClick={onCreateTable}
          style={{ width: "100%", border: "1.5px dashed #d5cdc3", borderRadius: 12, padding: 20, textAlign: "center", cursor: "pointer", background: "transparent", transition: "border-color 0.15s" }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "#b0a898"} onMouseLeave={e => e.currentTarget.style.borderColor = "#d5cdc3"}>
          <div style={{ fontSize: 20, color: "#d5cdc3", marginBottom: 4 }}>+</div>
          <div style={{ fontSize: 13, color: "#b0a898" }}>Create new table</div>
        </button>
      </div>
    </div>
  );
};
