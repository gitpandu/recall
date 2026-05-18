import { useState, useMemo, useEffect } from "react";
import { TableHeader } from "./TableHeader";
import { TableGrid } from "./TableGrid";
import { RowModal } from "./RowModal";
import { EditTableModal } from "./EditTableModal";
import { ManagePropertiesModal } from "./ManagePropertiesModal";
import { AttachmentGallery } from "./AttachmentGallery";
import { IconChevronLeft, IconPlus } from "../../components/ui/icons";
import { PAGE_SIZE } from "../../constants";
import type { Table, Row, Property, Attachment } from "../../types";

type FilterCondition = {
  id: string;
  propertyId: string;
  valueText: string;
  valueNumber: string;
  valueBoolean: "any" | "true" | "false";
  valueSelect: string;
  valueMulti: string;
  dateStart: string;
  dateEnd: string;
};

const createFilter = (propertyId: string): FilterCondition => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  propertyId,
  valueText: "",
  valueNumber: "",
  valueBoolean: "any",
  valueSelect: "",
  valueMulti: "",
  dateStart: "",
  dateEnd: "",
});

const normalizeDate = (value: unknown): string => {
  const raw = String(value ?? "").trim();
  if (!raw) return "";
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;
  return date.toISOString().slice(0, 10);
};

export const TableView = ({ table, onBack, onUpdateTable, onSaveRow, onSaveProperties, onUploadAttachment, onDeleteAttachment, onDeleteTable, onDeleteRow }: {
  table: Table;
  onBack: () => void;
  onUpdateTable: (t: Table) => Promise<void>;
  onSaveRow: (rowId: string | null, values: Record<string, unknown>) => Promise<string | void>;
  onSaveProperties: (properties: Property[]) => Promise<void>;
  onUploadAttachment: (rowId: string, file: File) => Promise<Attachment>;
  onDeleteAttachment: (rowId: string, attachmentId: string) => Promise<void>;
  onDeleteTable: (tableId: string) => Promise<void>;
  onDeleteRow: (rowId: string) => Promise<void>;
}) => {
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  const [sortPropId, setSortPropId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(`sortPropId_${table.id}`) ?? null;
    } catch {
      return null;
    }
  });
  const [sortDir, setSortDir] = useState<"asc" | "desc">(() => {
    try {
      return (localStorage.getItem(`sortDir_${table.id}`) as "asc" | "desc") ?? "asc";
    } catch {
      return "asc";
    }
  });
  const [page, setPage] = useState(1);
  const [rowModal, setRowModal] = useState<{ open: boolean; row: Row | null }>({ open: false, row: null });
  const [showEditTable, setShowEditTable] = useState(false);
  const [showManageProps, setShowManageProps] = useState(false);
  const [galleryRow, setGalleryRow] = useState<Row | null>(null);
  const [newRowId, setNewRowId] = useState<string | null>(null);
  const [highlightedRowId, setHighlightedRowId] = useState<string | null>(null);

  const propertiesById = useMemo(() => new Map(table.properties.map(p => [p.id, p])), [table.properties]);

  const activeFilters = useMemo(() => filters.filter(filter => {
    const prop = propertiesById.get(filter.propertyId);
    if (!prop) return false;
    if (prop.type === "text" || prop.type === "longtext") return Boolean(filter.valueText.trim());
    if (prop.type === "number" || prop.type === "currency_idr") return filter.valueNumber !== "";
    if (prop.type === "checkbox") return filter.valueBoolean !== "any";
    if (prop.type === "select") return Boolean(filter.valueSelect);
    if (prop.type === "multiselect") return Boolean(filter.valueMulti);
    if (prop.type === "date") return Boolean(filter.dateStart || filter.dateEnd);
    return false;
  }), [filters, propertiesById]);

  useEffect(() => {
    setFilters(prev => prev.filter(f => propertiesById.has(f.propertyId)));
    if (sortPropId && !propertiesById.has(sortPropId)) {
      setSortPropId(null);
      try {
        localStorage.removeItem(`sortPropId_${table.id}`);
        localStorage.removeItem(`sortDir_${table.id}`);
      } catch {}
    }
  }, [propertiesById, sortPropId, table.id]);

  useEffect(() => {
    setPage(1);
  }, [search, filters, table.id]);

  const filtered = useMemo(() => {
    let rows = table.rows ?? [];
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(row => table.properties.some(p => String(row.values[p.id] ?? "").toLowerCase().includes(q)));
    }

    if (activeFilters.length > 0) {
      rows = rows.filter(row => activeFilters.every(filter => {
        const prop = propertiesById.get(filter.propertyId);
        if (!prop) return true;
        const value = row.values[filter.propertyId];

        if (prop.type === "text" || prop.type === "longtext") {
          return String(value ?? "").toLowerCase().includes(filter.valueText.toLowerCase().trim());
        }

        if (prop.type === "number" || prop.type === "currency_idr") {
          return Number(value) === Number(filter.valueNumber);
        }

        if (prop.type === "checkbox") {
          if (filter.valueBoolean === "true") return Boolean(value);
          if (filter.valueBoolean === "false") return !Boolean(value);
          return true;
        }

        if (prop.type === "select") {
          return String(value ?? "") === filter.valueSelect;
        }

        if (prop.type === "multiselect") {
          return Array.isArray(value) && value.map(String).includes(filter.valueMulti);
        }

        if (prop.type === "date") {
          const rowDate = normalizeDate(value);
          if (!rowDate) return false;
          if (filter.dateStart && rowDate < filter.dateStart) return false;
          if (filter.dateEnd && rowDate > filter.dateEnd) return false;
          return true;
        }

        return true;
      }));
    }

    if (sortPropId) {
      const prop = table.properties.find(p => p.id === sortPropId);
      rows = [...rows].sort((a, b) => {
        const va = a.values[sortPropId] ?? "";
        const vb = b.values[sortPropId] ?? "";
        if (prop?.type === "number" || prop?.type === "currency_idr") {
          return sortDir === "asc" ? Number(va) - Number(vb) : Number(vb) - Number(va);
        }
        return sortDir === "asc" ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
      });
    }
    return rows;
  }, [table.rows, table.properties, search, sortPropId, sortDir, activeFilters, propertiesById]);

  useEffect(() => {
    if (newRowId) {
      const index = filtered.findIndex(r => r.id === newRowId);
      if (index !== -1) {
        const targetPage = Math.floor(index / PAGE_SIZE) + 1;
        if (targetPage !== page) {
          setPage(targetPage);
        }
        setHighlightedRowId(newRowId);
        setNewRowId(null);
      }
    }
  }, [filtered, newRowId, page]);

  useEffect(() => {
    if (highlightedRowId) {
      const timer = setTimeout(() => {
        setHighlightedRowId(null);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [highlightedRowId]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const handleSort = (propId: string | null, dir?: "asc" | "desc") => {
    if (propId === null) {
      setSortPropId(null);
      try {
        localStorage.removeItem(`sortPropId_${table.id}`);
        localStorage.removeItem(`sortDir_${table.id}`);
      } catch {}
    } else {
      const nextDir = dir ?? (sortPropId === propId && sortDir === "asc" ? "desc" : "asc");
      if (!dir && sortPropId === propId && sortDir === "desc") {
        setSortPropId(null);
        try {
          localStorage.removeItem(`sortPropId_${table.id}`);
          localStorage.removeItem(`sortDir_${table.id}`);
        } catch {}
      } else {
        setSortPropId(propId);
        setSortDir(nextDir);
        try {
          localStorage.setItem(`sortPropId_${table.id}`, propId);
          localStorage.setItem(`sortDir_${table.id}`, nextDir);
        } catch {}
      }
    }
    setPage(1);
  };

  const handleSaveRow = async (values: Record<string, unknown>) => {
    const isNew = !rowModal.row?.id;
    const savedId = await onSaveRow(rowModal.row?.id ?? null, values);
    if (isNew && savedId) {
      setNewRowId(savedId);
    }
  };

  const handleSaveProps = async (properties: Property[]) => {
    await onSaveProperties(properties);
  };

  const handleToggleSearch = () => {
    setSearchOpen(o => !o);
    if (searchOpen) { setSearch(""); setPage(1); }
  };

  const addFilter = () => {
    if (table.properties.length === 0) return;
    setFilters(prev => [...prev, createFilter(table.properties[0].id)]);
    setFiltersOpen(true);
  };

  const updateFilter = (id: string, patch: Partial<FilterCondition>) => {
    setFilters(prev => prev.map(f => f.id === id ? { ...f, ...patch } : f));
  };

  const removeFilter = (id: string) => {
    setFilters(prev => prev.filter(f => f.id !== id));
  };

  const clearFilters = () => {
    setFilters([]);
  };

  const handleDeleteTable = async () => {
    await onDeleteTable(table.id);
  };

  const handleSaveTable = async (nextTable: Table) => {
    await onUpdateTable(nextTable);
    setShowEditTable(false);
  };

  const handleDeleteRow = async (row: Row) => {
    const ok = window.confirm("Delete this row?");
    if (!ok) return;
    await onDeleteRow(row.id);
    setRowModal({ open: false, row: null });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f2ee", fontFamily: "'DM Sans', sans-serif", display: "flex", flexDirection: "column" }}>
      <div style={{ background: "#fff", borderBottom: "1px solid #e5dfd7", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={onBack}
          style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#8a7d70", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, padding: "6px 12px", marginLeft: -12, borderRadius: 8, transition: "all 0.15s" }}
          onMouseEnter={e => { e.currentTarget.style.color = table.color; e.currentTarget.style.background = `${table.color}11`; }}
          onMouseLeave={e => { e.currentTarget.style.color = "#8a7d70"; e.currentTarget.style.background = "transparent"; }}>
          <IconChevronLeft size={15} /> Back
        </button>
        <button
          onClick={() => setShowEditTable(true)}
          style={{ fontSize: 13, fontWeight: 600, color: "#6a5d50", background: "#fff", border: "1px solid #e5dfd7", borderRadius: 8, padding: "6px 12px", cursor: "pointer", transition: "all 0.15s", boxShadow: "0 1px 2px rgba(0,0,0,0.02)" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#c8bfb0"; e.currentTarget.style.background = "#faf8f5"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5dfd7"; e.currentTarget.style.background = "#fff"; }}>
          Table Settings
        </button>
      </div>
      <div style={{ flex: 1, padding: "24px", maxWidth: 1400, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5dfd7", boxShadow: "0 4px 12px rgba(60, 45, 30, 0.03), 0 1px 3px rgba(60, 45, 30, 0.02)", display: "flex", flexDirection: "column", overflow: "hidden" }}>

      <TableHeader
        table={table}
        search={search}
        searchOpen={searchOpen}
        filtersOpen={filtersOpen}
        activeFilterCount={activeFilters.length}
        sortPropId={sortPropId}
        sortDir={sortDir}
        onSearchChange={setSearch}
        onToggleSearch={handleToggleSearch}
        onToggleFilters={() => setFiltersOpen(o => !o)}
        onManageProps={() => setShowManageProps(true)}
        onSort={handleSort}
      />

      {filtersOpen && (
        <div style={{ padding: "10px 16px", borderBottom: "1px solid #e5dfd7", background: "#faf8f5", display: "grid", gap: 8 }}>
          {filters.map(filter => {
            const prop = propertiesById.get(filter.propertyId);
            if (!prop) return null;
            return (
              <div key={filter.id} style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr auto", gap: 8, alignItems: "center" }}>
                <select
                  value={filter.propertyId}
                  onChange={e => updateFilter(filter.id, { propertyId: e.target.value, valueText: "", valueNumber: "", valueBoolean: "any", valueSelect: "", valueMulti: "", dateStart: "", dateEnd: "" })}
                  style={{ border: "1px solid #e5dfd7", borderRadius: 8, padding: "7px 10px", background: "#fff", fontSize: 12 }}>
                  {table.properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>

                {(prop.type === "text" || prop.type === "longtext") && (
                  <input value={filter.valueText} onChange={e => updateFilter(filter.id, { valueText: e.target.value })} placeholder="contains..."
                    style={{ border: "1px solid #e5dfd7", borderRadius: 8, padding: "7px 10px", background: "#fff", fontSize: 12 }} />
                )}
                {(prop.type === "number" || prop.type === "currency_idr") && (
                  <input type="number" value={filter.valueNumber} onChange={e => updateFilter(filter.id, { valueNumber: e.target.value })} placeholder="equals"
                    style={{ border: "1px solid #e5dfd7", borderRadius: 8, padding: "7px 10px", background: "#fff", fontSize: 12 }} />
                )}
                {prop.type === "checkbox" && (
                  <select value={filter.valueBoolean} onChange={e => updateFilter(filter.id, { valueBoolean: e.target.value as FilterCondition["valueBoolean"] })}
                    style={{ border: "1px solid #e5dfd7", borderRadius: 8, padding: "7px 10px", background: "#fff", fontSize: 12 }}>
                    <option value="any">Any</option>
                    <option value="true">Checked</option>
                    <option value="false">Unchecked</option>
                  </select>
                )}
                {prop.type === "select" && (
                  <select value={filter.valueSelect} onChange={e => updateFilter(filter.id, { valueSelect: e.target.value })}
                    style={{ border: "1px solid #e5dfd7", borderRadius: 8, padding: "7px 10px", background: "#fff", fontSize: 12 }}>
                    <option value="">Any option</option>
                    {(prop.options ?? []).map(option => <option key={option} value={option}>{option}</option>)}
                  </select>
                )}
                {prop.type === "multiselect" && (
                  <select value={filter.valueMulti} onChange={e => updateFilter(filter.id, { valueMulti: e.target.value })}
                    style={{ border: "1px solid #e5dfd7", borderRadius: 8, padding: "7px 10px", background: "#fff", fontSize: 12 }}>
                    <option value="">Any option</option>
                    {(prop.options ?? []).map(option => <option key={option} value={option}>{option}</option>)}
                  </select>
                )}
                {prop.type === "date" && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                    <input type="date" value={filter.dateStart} onChange={e => updateFilter(filter.id, { dateStart: e.target.value })}
                      style={{ border: "1px solid #e5dfd7", borderRadius: 8, padding: "7px 8px", background: "#fff", fontSize: 12 }} />
                    <input type="date" value={filter.dateEnd} onChange={e => updateFilter(filter.id, { dateEnd: e.target.value })}
                      style={{ border: "1px solid #e5dfd7", borderRadius: 8, padding: "7px 8px", background: "#fff", fontSize: 12 }} />
                  </div>
                )}

                <button onClick={() => removeFilter(filter.id)}
                  style={{ border: "1px solid #e5dfd7", borderRadius: 8, padding: "7px 9px", background: "#fff", color: "#b55a5a", fontSize: 12, cursor: "pointer" }}>
                  Remove
                </button>
              </div>
            );
          })}

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={addFilter}
              style={{ border: `1px solid ${table.color}44`, borderRadius: 8, padding: "7px 10px", background: `${table.color}11`, color: table.color, fontSize: 12, cursor: "pointer" }}>
              + Add filter
            </button>
            {filters.length > 0 && (
              <button onClick={clearFilters}
                style={{ border: "1px solid #e5dfd7", borderRadius: 8, padding: "7px 10px", background: "#fff", color: "#8a7d70", fontSize: 12, cursor: "pointer" }}>
                Clear all
              </button>
            )}
          </div>
        </div>
      )}

      {activeFilters.length > 0 && (
        <div style={{ padding: "8px 16px", borderBottom: "1px solid #e5dfd7", background: "#faf8f5", display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          {activeFilters.map(filter => {
            const prop = propertiesById.get(filter.propertyId);
            if (!prop) return null;
            let label = "";
            if (prop.type === "text" || prop.type === "longtext") label = `${prop.name}: contains \"${filter.valueText}\"`;
            if (prop.type === "number" || prop.type === "currency_idr") label = `${prop.name}: = ${filter.valueNumber}`;
            if (prop.type === "checkbox") label = `${prop.name}: ${filter.valueBoolean === "true" ? "checked" : "unchecked"}`;
            if (prop.type === "select") label = `${prop.name}: ${filter.valueSelect}`;
            if (prop.type === "multiselect") label = `${prop.name}: has ${filter.valueMulti}`;
            if (prop.type === "date") label = `${prop.name}: ${filter.dateStart || "..."} to ${filter.dateEnd || "..."}`;
            return (
              <button key={filter.id} onClick={() => removeFilter(filter.id)}
                style={{ border: `1px solid ${prop.color}44`, borderRadius: 999, padding: "3px 10px", background: `${prop.color}1a`, color: prop.color, fontSize: 11, cursor: "pointer" }}>
                {label} ×
              </button>
            );
          })}
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", borderBottom: "1px solid #e5dfd7", background: "#fff" }}>
        <span style={{ fontSize: 13, color: "#8a7d70", fontWeight: 500 }}>{filtered.length} record{filtered.length !== 1 ? "s" : ""}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            style={{ fontSize: 13, padding: "5px 11px", borderRadius: 6, border: "1px solid #e5dfd7", background: "#fff", color: "#6a5d50", cursor: page === 1 ? "default" : "pointer", opacity: page === 1 ? 0.4 : 1, transition: "background 0.15s" }}
            onMouseEnter={e => { if (page !== 1) e.currentTarget.style.background = "#faf8f5"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#fff"; }}>←</button>
          <span style={{ fontSize: 12, color: "#8a7d70", fontWeight: 600, minWidth: 40, textAlign: "center" }}>{page} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            style={{ fontSize: 13, padding: "5px 11px", borderRadius: 6, border: "1px solid #e5dfd7", background: "#fff", color: "#6a5d50", cursor: page === totalPages ? "default" : "pointer", opacity: page === totalPages ? 0.4 : 1, transition: "background 0.15s" }}
            onMouseEnter={e => { if (page !== totalPages) e.currentTarget.style.background = "#faf8f5"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#fff"; }}>→</button>
        </div>
      </div>

        <TableGrid
          table={table}
          filtered={filtered}
          page={page}
          sortPropId={sortPropId}
          sortDir={sortDir}
          onEditRow={row => setRowModal({ open: true, row })}
          onViewAttachments={row => setGalleryRow(row)}
          onSort={handleSort}
          highlightedRowId={highlightedRowId}
        />
        </div>
      </div>

      <button onClick={() => setRowModal({ open: true, row: null })}
        style={{ position: "fixed", bottom: 28, right: 24, zIndex: 40, display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 999, background: table.color, border: "none", cursor: "pointer", padding: "14px 18px", boxShadow: `0 4px 20px ${table.color}55`, transition: "transform 0.15s, box-shadow 0.15s" }}
        onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.04)"; e.currentTarget.style.boxShadow = `0 6px 24px ${table.color}77`; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = `0 4px 20px ${table.color}55`; }}>
        <IconPlus size={18} color="#fff" />
        <span style={{ color: "#fff", fontSize: 13, fontWeight: 700, letterSpacing: "0.01em" }}>Add Row</span>
      </button>

      {rowModal.open && (
        <RowModal
          table={table}
          row={rowModal.row}
          onClose={() => setRowModal({ open: false, row: null })}
          onSave={handleSaveRow}
          onUploadAttachment={onUploadAttachment}
          onDeleteAttachment={onDeleteAttachment}
          onDeleteRow={rowModal.row ? () => { void handleDeleteRow(rowModal.row!); } : undefined}
        />
      )}
      {showEditTable && (
        <EditTableModal
          table={table}
          onClose={() => setShowEditTable(false)}
          onSave={handleSaveTable}
          onDelete={handleDeleteTable}
        />
      )}
      {showManageProps && (
        <ManagePropertiesModal table={table} onClose={() => setShowManageProps(false)} onSave={handleSaveProps} />
      )}
      {galleryRow && (
        <AttachmentGallery attachments={galleryRow.attachments} onClose={() => setGalleryRow(null)} />
      )}
    </div>
  );
};
