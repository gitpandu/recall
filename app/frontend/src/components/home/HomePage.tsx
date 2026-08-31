import { useState, useMemo, useRef, useEffect } from "react";
import { TableCard } from "./TableCard";
import { IconButton } from "../../components/ui/IconButton";
import { IconSearch, IconSort, IconFilter, IconX } from "../../components/ui/icons";
import type { Table } from "../../types";

type SortOption = "recent" | "name_asc" | "name_desc" | "rows_asc" | "rows_desc";

const sortLabels: Record<SortOption, string> = {
  recent: "Recently added",
  name_asc: "Name A–Z",
  name_desc: "Name Z–A",
  rows_asc: "Fewest rows",
  rows_desc: "Most rows",
};

const GroupHeaderInput = ({ groupName, onRename }: { groupName: string; onRename: (newName: string) => void }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [isEmpty, setIsEmpty] = useState(!groupName);
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (ref.current) {
      if (ref.current.textContent !== groupName) {
        ref.current.textContent = groupName;
        setIsEmpty(!groupName);
      }
    }
  }, [groupName]);

  const handleBlur = () => {
    setIsFocused(false);
    if (ref.current) {
      const text = ref.current.textContent?.trim() || "";
      onRename(text);
      setIsEmpty(!text);
    }
  };

  const handleInput = (e: React.FormEvent<HTMLSpanElement>) => {
    setIsEmpty(!e.currentTarget.textContent);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      ref.current?.blur();
    }
  };

  return (
    <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
      <span
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onBlur={handleBlur}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 12,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: isEmpty ? "transparent" : "#3d3028",
          border: "none",
          background: isFocused ? "#fff" : isHovered ? "#e5dfd770" : "transparent",
          boxShadow: isFocused ? "0 0 0 1.5px #c0764a" : "none",
          outline: "none",
          padding: "4px 8px",
          borderRadius: 4,
          transition: "all 0.15s",
          display: "inline-block",
          minWidth: isEmpty ? "120px" : "1ch",
          maxWidth: "320px",
          wordBreak: "break-word",
          whiteSpace: "pre-wrap",
          cursor: "text",
          lineHeight: "1.4",
          boxSizing: "border-box"
        }}
      />
      {isEmpty && (
        <span
          style={{
            position: "absolute",
            left: 8,
            top: "50%",
            transform: "translateY(-50%)",
            color: "#b0a898",
            pointerEvents: "none",
            userSelect: "none",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase"
          }}
        >
          UNTITLED GROUP
        </span>
      )}
    </div>
  );
};

export const HomePage = ({ tables, onSelectTable, onCreateTable, onTogglePin, onUpdateTable }: {
  tables: Table[];
  onSelectTable: (t: Table) => void;
  onCreateTable: () => void;
  onTogglePin: (table: Table) => void;
  onUpdateTable?: (table: Table) => Promise<void>;
}) => {
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sort, setSort] = useState<SortOption>("recent");
  const [filters, setFilters] = useState<{ pinnedOnly: boolean; hasRows: boolean; noRows: boolean }>({
    pinnedOnly: false,
    hasRows: false,
    noRows: false,
  });
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (searchOpen) searchRef.current?.focus(); }, [searchOpen]);

  const activeGroups = useMemo(() => {
    return Array.from(new Set(tables.map(t => t.group).filter(Boolean)));
  }, [tables]);

  const filtered = useMemo(() => {
    let t = tables;
    if (search.trim()) {
      const q = search.toLowerCase();
      t = t.filter(tbl => tbl.name.toLowerCase().includes(q) || tbl.description.toLowerCase().includes(q));
    }
    if (filters.pinnedOnly) t = t.filter(tbl => tbl.pinned);
    if (filters.hasRows) t = t.filter(tbl => tbl.rowCount > 0);
    if (filters.noRows) t = t.filter(tbl => tbl.rowCount === 0);
    
    // Sort logic for flat layout
    if (activeGroups.length === 0) {
      const sorted = [...t].sort((a, b) => {
        if (sort === "name_asc") return a.name.localeCompare(b.name);
        if (sort === "name_desc") return b.name.localeCompare(a.name);
        if (sort === "rows_asc") return a.rowCount - b.rowCount;
        if (sort === "rows_desc") return b.rowCount - a.rowCount;
        return 0;
      });
      return sorted.sort((a, b) => Number(b.pinned) - Number(a.pinned));
    }

    return t;
  }, [tables, search, sort, filters, activeGroups]);

  const groupedTables = useMemo(() => {
    if (activeGroups.length === 0) return null;

    const map: Record<string, Table[]> = {};
    activeGroups.forEach(g => {
      map[g] = [];
    });
    map[""] = [];

    filtered.forEach(t => {
      const key = t.group || "";
      if (map[key]) {
        map[key].push(t);
      } else {
        map[key] = [t];
      }
    });

    // Sort within each group: pinned first, then selected sort option
    Object.keys(map).forEach(key => {
      map[key] = [...map[key]].sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;

        if (sort === "name_asc") return a.name.localeCompare(b.name);
        if (sort === "name_desc") return b.name.localeCompare(a.name);
        if (sort === "rows_asc") return a.rowCount - b.rowCount;
        if (sort === "rows_desc") return b.rowCount - a.rowCount;
        return 0;
      });
    });

    return map;
  }, [filtered, activeGroups, sort]);

  const handleRenameGroup = async (oldName: string, newName: string) => {
    const trimmedNewName = newName.trim();
    if (oldName === trimmedNewName) return;
    const tablesToUpdate = tables.filter(t => t.group === oldName);
    try {
      await Promise.all(
        tablesToUpdate.map(t => onUpdateTable?.({ ...t, group: trimmedNewName }))
      );
    } catch (err) {
      console.error("Failed to rename group:", err);
    }
  };

  const activeFilterCount = Number(filters.pinnedOnly) + Number(filters.hasRows) + Number(filters.noRows);

  const sortedGroups = useMemo(() => {
    return [...activeGroups].sort((a, b) => a.localeCompare(b));
  }, [activeGroups]);

  return (
    <div style={{ minHeight: "100vh", background: "#f5f2ee", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ background: "#faf8f5", borderBottom: "1px solid #e5dfd7" }}>
        <div style={{ padding: "32px 20px 16px", maxWidth: 1200, margin: "0 auto" }}>
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
                  onClick={() => { setFilterOpen(o => !o); setSearchOpen(false); setSortOpen(false); }}
                  active={filterOpen || activeFilterCount > 0} activeColor="#c0764a" title="Filter tables">
                  <IconFilter size={15} />
                </IconButton>
                {filterOpen && (
                  <div style={{ position: "absolute", right: 0, top: "calc(100% + 6px)", background: "#fff", border: "1px solid #e5dfd7", borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.1)", zIndex: 20, minWidth: 190, padding: 8 }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#3d3028", padding: "6px 8px", cursor: "pointer" }}>
                      <input type="checkbox" checked={filters.pinnedOnly} onChange={e => setFilters(prev => ({ ...prev, pinnedOnly: e.target.checked }))} />
                      Pinned only
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#3d3028", padding: "6px 8px", cursor: "pointer" }}>
                      <input type="checkbox" checked={filters.hasRows} onChange={e => setFilters(prev => ({ ...prev, hasRows: e.target.checked, noRows: e.target.checked ? false : prev.noRows }))} />
                      Has rows
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#3d3028", padding: "6px 8px", cursor: "pointer" }}>
                      <input type="checkbox" checked={filters.noRows} onChange={e => setFilters(prev => ({ ...prev, noRows: e.target.checked, hasRows: e.target.checked ? false : prev.hasRows }))} />
                      No rows
                    </label>
                    {activeFilterCount > 0 && (
                      <button onClick={() => setFilters({ pinnedOnly: false, hasRows: false, noRows: false })}
                        style={{ marginTop: 6, width: "100%", border: "1px solid #e5dfd7", borderRadius: 8, background: "#faf8f5", fontSize: 12, color: "#8a7d70", padding: "6px 8px", cursor: "pointer" }}>
                        Clear filters
                      </button>
                    )}
                  </div>
                )}
              </div>
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
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
        <div style={{ padding: "16px 0 12px", display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 11, color: "#b0a898" }}>{filtered.length} table{filtered.length !== 1 ? "s" : ""}</span>
          <span style={{ fontSize: 11, color: "#b0a898" }}>{sortLabels[sort]}</span>
        </div>

        {activeFilterCount > 0 && (
          <div style={{ padding: "4px 0 12px", display: "flex", gap: 6, flexWrap: "wrap" }}>
            {filters.pinnedOnly && <button onClick={() => setFilters(prev => ({ ...prev, pinnedOnly: false }))} style={{ border: "1px solid #d5cdc3", borderRadius: 999, background: "#faf8f5", color: "#8a7d70", fontSize: 11, padding: "3px 8px", cursor: "pointer" }}>Pinned ×</button>}
            {filters.hasRows && <button onClick={() => setFilters(prev => ({ ...prev, hasRows: false }))} style={{ border: "1px solid #d5cdc3", borderRadius: 999, background: "#faf8f5", color: "#8a7d70", fontSize: 11, padding: "3px 8px", cursor: "pointer" }}>Has rows ×</button>}
            {filters.noRows && <button onClick={() => setFilters(prev => ({ ...prev, noRows: false }))} style={{ border: "1px solid #d5cdc3", borderRadius: 999, background: "#faf8f5", color: "#8a7d70", fontSize: 11, padding: "3px 8px", cursor: "pointer" }}>No rows ×</button>}
          </div>
        )}

        {/* Flat Grid Layout when no groups exist */}
        {activeGroups.length === 0 && (
          <div style={{ padding: "4px 0 32px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
            {filtered.length === 0 && search.trim() && (
              <div style={{ gridColumn: "1 / -1", padding: "60px 0", textAlign: "center", color: "#b0a898", fontSize: 14 }}>
                No tables match your search
              </div>
            )}
            {filtered.map(table => (
              <TableCard key={table.id} table={table} onClick={() => onSelectTable(table)} onTogglePin={onTogglePin} />
            ))}
            {!(search.trim() && filtered.length === 0) && (
              <button onClick={onCreateTable}
                style={{ width: "100%", height: "100%", minHeight: 120, border: "2px dashed #d5cdc3", borderRadius: 12, padding: 20, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "transparent", transition: "all 0.2s ease" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#c0764a"; e.currentTarget.style.background = "#faf8f5"; }} onMouseLeave={e => { e.currentTarget.style.borderColor = "#d5cdc3"; e.currentTarget.style.background = "transparent"; }}>
                <div style={{ fontSize: 24, color: "#c0764a", marginBottom: 8, fontWeight: 300 }}>+</div>
                <div style={{ fontSize: 14, color: "#8a7d70", fontWeight: 500 }}>Create new table</div>
              </button>
            )}
          </div>
        )}

        {/* Grouped Outline Layout when at least one group exists */}
        {activeGroups.length > 0 && (
          <div style={{ padding: "20px 0 32px" }}>
            {filtered.length === 0 && search.trim() && (
              <div style={{ padding: "60px 0", textAlign: "center", color: "#b0a898", fontSize: 14 }}>
                No tables match your search
              </div>
            )}

            {/* Render each active group outline */}
            {sortedGroups.map(groupName => {
              const tablesInGroup = groupedTables?.[groupName] ?? [];
              if (tablesInGroup.length === 0) return null;

              return (
                <div key={groupName} style={{
                  border: "1px solid #e5dfd7",
                  borderRadius: 16,
                  padding: "32px 20px 20px",
                  marginBottom: 32,
                  background: "transparent",
                  position: "relative"
                }}>
                  <div style={{
                    position: "absolute",
                    top: "-12px",
                    left: "20px",
                    background: "#f5f2ee",
                    padding: "0 8px",
                    display: "flex",
                    alignItems: "center",
                    gap: 6
                  }}>
                    <GroupHeaderInput groupName={groupName} onRename={(newName) => handleRenameGroup(groupName, newName)} />
                    <span style={{ fontSize: 11, color: "#b0a898", fontWeight: 500 }}>( {tablesInGroup.length} )</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
                    {tablesInGroup.map(table => (
                      <TableCard key={table.id} table={table} onClick={() => onSelectTable(table)} onTogglePin={onTogglePin} />
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Render ungrouped tables outline at the bottom */}
            {(() => {
              const ungroupedTables = groupedTables?.[""] ?? [];
              if (ungroupedTables.length === 0 && search.trim()) return null;

              return (
                <div style={{
                  border: "1px solid #e5dfd7",
                  borderRadius: 16,
                  padding: "32px 20px 20px",
                  marginBottom: 32,
                  background: "transparent",
                  position: "relative"
                }}>
                  <div style={{
                    position: "absolute",
                    top: "-12px",
                    left: "20px",
                    background: "#f5f2ee",
                    padding: "0 8px",
                    display: "flex",
                    alignItems: "center",
                    gap: 6
                  }}>
                    <h3 style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#8a7d70",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      margin: 0
                    }}>
                      Ungrouped Tables
                    </h3>
                    <span style={{ fontSize: 11, color: "#b0a898", fontWeight: 500 }}>( {ungroupedTables.length} )</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
                    {ungroupedTables.map(table => (
                      <TableCard key={table.id} table={table} onClick={() => onSelectTable(table)} onTogglePin={onTogglePin} />
                    ))}
                    {!(search.trim() && ungroupedTables.length === 0) && (
                      <button onClick={onCreateTable}
                        style={{ width: "100%", height: "100%", minHeight: 120, border: "2px dashed #d5cdc3", borderRadius: 12, padding: 20, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "transparent", transition: "all 0.2s ease" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "#c0764a"; e.currentTarget.style.background = "#faf8f5"; }} onMouseLeave={e => { e.currentTarget.style.borderColor = "#d5cdc3"; e.currentTarget.style.background = "transparent"; }}>
                        <div style={{ fontSize: 24, color: "#c0764a", marginBottom: 8, fontWeight: 300 }}>+</div>
                        <div style={{ fontSize: 14, color: "#8a7d70", fontWeight: 500 }}>Create new table</div>
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};
