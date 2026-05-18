import { useEffect, useMemo, useState } from "react";
import { HomePage } from "./components/home/HomePage";
import { TableView } from "./components/table/TableView";
import { CreateTableModal } from "./components/home/CreateTableModal";
import {
  createProperty,
  createRow,
  createTable,
  deleteAttachment,
  uploadAttachment,
  getProperties,
  getRows,
  getTables,
  updateProperty,
  updateRow,
  updateTable,
  deleteProperty,
  deleteRow,
  deleteTable,
} from "./lib/api";
import type { Property, Table } from "./types";

export default function App() {
  const [tables, setTables] = useState<Table[]>([]);
  const [activeTableId, setActiveTableId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTables = async () => {
    try {
      setError(null);
      const data = await getTables();
      setTables(prev => data.map(t => {
        const existing = prev.find(p => p.id === t.id);
        return { ...t, rows: existing?.rows ?? [] };
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tables");
    } finally {
      setLoading(false);
    }
  };

  const loadTableRows = async (tableId: string) => {
    const rows = await getRows(tableId);
    setTables(prev => prev.map(t => (t.id === tableId ? { ...t, rows, rowCount: rows.length } : t)));
  };

  const loadTableProperties = async (tableId: string) => {
    const properties = await getProperties(tableId);
    setTables(prev => prev.map(t => (t.id === tableId ? { ...t, properties } : t)));
  };

  useEffect(() => {
    void loadTables();
  }, []);

  useEffect(() => {
    if (!activeTableId) return;
    void loadTableRows(activeTableId);
    void loadTableProperties(activeTableId);
  }, [activeTableId]);

  const activeTable = useMemo(
    () => tables.find(t => t.id === activeTableId) ?? null,
    [tables, activeTableId],
  );

  const handleUpdateTable = async (updated: Table) => {
    const saved = await updateTable(updated.id, {
      name: updated.name,
      description: updated.description,
      color: updated.color,
      pinned: updated.pinned,
    });
    setTables(prev => prev.map(t => (t.id === saved.id ? { ...t, ...saved } : t)));
  };

  const handleTogglePin = async (table: Table) => {
    const saved = await updateTable(table.id, { pinned: !table.pinned });
    setTables(prev => prev.map(t => (t.id === saved.id ? { ...t, ...saved } : t)));
  };

  const handleCreateTable = async (data: { name: string; description: string; color: string }) => {
    const table = await createTable(data);
    const titleProp = await createProperty(table.id, { name: "Title", type: "text", color: table.color });
    setTables(prev => [...prev, { ...table, properties: [titleProp], rows: [] }]);
  };

  const handleSaveRow = async (rowId: string | null, values: Record<string, unknown>) => {
    if (!activeTableId) return;
    let savedRow;
    if (rowId) savedRow = await updateRow(activeTableId, rowId, { values });
    else savedRow = await createRow(activeTableId, { values });
    await loadTableRows(activeTableId);
    return savedRow.id;
  };

  const handleSaveProperties = async (nextProperties: Property[]) => {
    if (!activeTableId || !activeTable) return;
    const existingById = new Map(activeTable.properties.map(p => [p.id, p]));

    for (let i = 0; i < nextProperties.length; i += 1) {
      const prop = nextProperties[i];
      const payload = {
        name: prop.name,
        type: prop.type,
        color: prop.color,
        options: prop.options,
        order: i,
      };
      if (existingById.has(prop.id)) await updateProperty(activeTableId, prop.id, payload);
      else await createProperty(activeTableId, payload);
    }

    const nextIds = new Set(nextProperties.map(p => p.id));
    for (const oldProp of activeTable.properties) {
      if (!nextIds.has(oldProp.id)) await deleteProperty(activeTableId, oldProp.id);
    }

    await loadTableProperties(activeTableId);
  };

  const handleDeleteTable = async (tableId: string) => {
    await deleteTable(tableId);
    setTables(prev => prev.filter(t => t.id !== tableId));
    setActiveTableId(current => (current === tableId ? null : current));
  };

  const handleDeleteRow = async (rowId: string) => {
    if (!activeTableId) return;
    await deleteRow(activeTableId, rowId);
    await loadTableRows(activeTableId);
  };

  const handleUploadAttachment = async (rowId: string, file: File) => {
    const uploaded = await uploadAttachment(rowId, file);
    if (activeTableId) await loadTableRows(activeTableId);
    return uploaded;
  };

  const handleDeleteAttachment = async (rowId: string, attachmentId: string) => {
    await deleteAttachment(rowId, attachmentId);
    if (activeTableId) await loadTableRows(activeTableId);
  };

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
  if (error) return <div style={{ padding: 20, color: "#b55a5a" }}>Error: {error}</div>;

  if (activeTable) {
    return (
      <TableView
        table={activeTable}
        onBack={() => setActiveTableId(null)}
        onUpdateTable={handleUpdateTable}
        onSaveRow={handleSaveRow}
        onSaveProperties={handleSaveProperties}
        onUploadAttachment={handleUploadAttachment}
        onDeleteAttachment={handleDeleteAttachment}
        onDeleteTable={handleDeleteTable}
        onDeleteRow={handleDeleteRow}
      />
    );
  }

  return (
    <>
      <HomePage tables={tables} onSelectTable={t => setActiveTableId(t.id)} onCreateTable={() => setShowCreate(true)} onTogglePin={(table) => { void handleTogglePin(table); }} />
      {showCreate && <CreateTableModal onClose={() => setShowCreate(false)} onCreate={(data) => { void handleCreateTable(data); }} />}
    </>
  );
}
