import { useCallback } from "react";
import { generateId } from "../lib/utils";
import type { Table, Row, Attachment } from "../types";

export const useRows = (table: Table, onUpdateTable: (t: Table) => void) => {
  const rows = table.rows ?? [];

  const addRow = useCallback((values: Record<string, unknown>, attachments: Attachment[]) => {
    const newRow: Row = { id: generateId(), tableId: table.id, values, attachments };
    const updated = [...rows, newRow];
    onUpdateTable({ ...table, rows: updated, rowCount: updated.length });
  }, [table, rows, onUpdateTable]);

  const updateRow = useCallback((rowId: string, values: Record<string, unknown>, attachments: Attachment[]) => {
    const updated = rows.map(r => r.id === rowId ? { ...r, values, attachments } : r);
    onUpdateTable({ ...table, rows: updated });
  }, [table, rows, onUpdateTable]);

  const deleteRow = useCallback((rowId: string) => {
    const updated = rows.filter(r => r.id !== rowId);
    onUpdateTable({ ...table, rows: updated, rowCount: updated.length });
  }, [table, rows, onUpdateTable]);

  const saveRow = useCallback((row: Row | null, values: Record<string, unknown>, attachments: Attachment[]) => {
    if (row) updateRow(row.id, values, attachments);
    else addRow(values, attachments);
  }, [addRow, updateRow]);

  return { rows, addRow, updateRow, deleteRow, saveRow };
};