import { useState, useMemo } from "react";
import { TableHeader } from "./TableHeader";
import { TableGrid } from "./TableGrid";
import { RowModal } from "./RowModal";
import { ManagePropertiesModal } from "./ManagePropertiesModal";
import { AttachmentGallery } from "./AttachmentGallery";
import { IconChevronLeft, IconPlus } from "../../components/ui/icons";
import { PAGE_SIZE } from "../../constants";
import type { Table, Row, Property, Attachment } from "../../types";

export const TableView = ({ table, onBack, onUpdateTable, onSaveRow, onSaveProperties, onUploadAttachment, onDeleteAttachment }: {
  table: Table;
  onBack: () => void;
  onUpdateTable: (t: Table) => Promise<void>;
  onSaveRow: (rowId: string | null, values: Record<string, unknown>) => Promise<void>;
  onSaveProperties: (properties: Property[]) => Promise<void>;
  onUploadAttachment: (rowId: string, file: File) => Promise<Attachment>;
  onDeleteAttachment: (rowId: string, attachmentId: string) => Promise<void>;
}) => {
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [sortPropId, setSortPropId] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [rowModal, setRowModal] = useState<{ open: boolean; row: Row | null }>({ open: false, row: null });
  const [showManageProps, setShowManageProps] = useState(false);
  const [galleryRow, setGalleryRow] = useState<Row | null>(null);

  const filtered = useMemo(() => {
    let rows = table.rows ?? [];
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(row => table.properties.some(p => String(row.values[p.id] ?? "").toLowerCase().includes(q)));
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
  }, [table.rows, table.properties, search, sortPropId, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const handleSort = (id: string) => {
    if (sortPropId === id) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortPropId(id); setSortDir("asc"); }
    setPage(1);
  };

  const handleSaveRow = async (values: Record<string, unknown>) => {
    await onSaveRow(rowModal.row?.id ?? null, values);
  };

  const handleSaveProps = async (properties: Property[]) => {
    await onSaveProperties(properties);
  };

  const handleToggleSearch = () => {
    setSearchOpen(o => !o);
    if (searchOpen) { setSearch(""); setPage(1); }
  };

  const handleSearchChange = (v: string) => {
    setSearch(v);
    setPage(1);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f2ee", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ background: "#faf8f5", borderBottom: "1px solid #ede9e3", padding: "10px 16px" }}>
        <button onClick={onBack}
          style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#8a7d70", background: "none", border: "none", cursor: "pointer", fontSize: 13 }}
          onMouseEnter={e => e.currentTarget.style.color = table.color}
          onMouseLeave={e => e.currentTarget.style.color = "#8a7d70"}>
          <IconChevronLeft size={15} /> Back to tables
        </button>
      </div>

      <TableHeader
        table={table}
        search={search}
        searchOpen={searchOpen}
        onUpdateTable={onUpdateTable}
        onSearchChange={handleSearchChange}
        onToggleSearch={handleToggleSearch}
        onManageProps={() => setShowManageProps(true)}
      />

      <TableGrid
        table={table}
        filtered={filtered}
        page={page}
        sortPropId={sortPropId}
        sortDir={sortDir}
        onEditRow={row => setRowModal({ open: true, row })}
        onViewAttachments={row => setGalleryRow(row)}
        onSort={handleSort}
      />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderTop: "1px solid #e5dfd7", background: "#faf8f5" }}>
        <span style={{ fontSize: 12, color: "#b0a898" }}>{filtered.length} record{filtered.length !== 1 ? "s" : ""}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            style={{ fontSize: 13, padding: "5px 11px", borderRadius: 6, border: "1px solid #e5dfd7", background: "#fff", color: "#6a5d50", cursor: page === 1 ? "default" : "pointer", opacity: page === 1 ? 0.4 : 1 }}>←</button>
          <span style={{ fontSize: 12, color: "#8a7d70" }}>{page} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            style={{ fontSize: 13, padding: "5px 11px", borderRadius: 6, border: "1px solid #e5dfd7", background: "#fff", color: "#6a5d50", cursor: page === totalPages ? "default" : "pointer", opacity: page === totalPages ? 0.4 : 1 }}>→</button>
        </div>
      </div>

      <button onClick={() => setRowModal({ open: true, row: null })}
        style={{ position: "fixed", bottom: 28, right: 24, zIndex: 40, width: 52, height: 52, borderRadius: "50%", background: table.color, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 20px ${table.color}55`, transition: "transform 0.15s, box-shadow 0.15s" }}
        onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.08)"; e.currentTarget.style.boxShadow = `0 6px 24px ${table.color}77`; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = `0 4px 20px ${table.color}55`; }}>
        <IconPlus size={22} color="#fff" />
      </button>

      {rowModal.open && (
        <RowModal
          table={table}
          row={rowModal.row}
          onClose={() => setRowModal({ open: false, row: null })}
          onSave={handleSaveRow}
          onUploadAttachment={onUploadAttachment}
          onDeleteAttachment={onDeleteAttachment}
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
