import { useState, useCallback } from "react";
import { generateId } from "../lib/utils";
import type { Table, Property } from "../types";

export const useTables = (initial: Table[] = []) => {
  const [tables, setTables] = useState<Table[]>(initial);

  const createTable = useCallback((data: Omit<Table, "id" | "rowCount">) => {
    const table: Table = { ...data, id: generateId(), rowCount: 0 };
    setTables(prev => [...prev, table]);
    return table;
  }, []);

  const updateTable = useCallback((updated: Table) => {
    setTables(prev => prev.map(t => t.id === updated.id ? updated : t));
  }, []);

  const deleteTable = useCallback((id: string) => {
    setTables(prev => prev.filter(t => t.id !== id));
  }, []);

  const updateProperties = useCallback((tableId: string, properties: Property[]) => {
    setTables(prev => prev.map(t => t.id === tableId ? { ...t, properties } : t));
  }, []);

  return { tables, createTable, updateTable, deleteTable, updateProperties };
};