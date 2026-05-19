import { Router } from "express";
import { db } from "../db/client.js";
import { nanoid } from "nanoid";

export const rowsRouter = Router({ mergeParams: true });

// GET /tables/:tableId/rows
rowsRouter.get("/", (req, res, next) => {
  try {
    const { tableId } = req.params as { tableId: string };
    const allRows = db.prepare("SELECT * FROM rows WHERE table_id = ? ORDER BY created_at").all(tableId) as any[];
    
    const result = allRows.map(r => {
      const atts = db.prepare("SELECT * FROM attachments WHERE row_id = ?").all(r.id) as any[];
      return { 
        ...r, 
        tableId: r.table_id,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
        values: JSON.parse(r.values), 
        attachments: atts.map(a => ({ ...a, rowId: a.row_id }))
      };
    });
    
    res.json(result);
  } catch (err) { next(err); }
});

// POST /tables/:tableId/rows
rowsRouter.post("/", (req, res, next) => {
  try {
    const { tableId } = req.params as { tableId: string };
    const { values = {} } = req.body;
    const id = nanoid();
    
    db.prepare("INSERT INTO rows (id, table_id, \"values\", created_at, updated_at) VALUES (?, ?, ?, unixepoch(), unixepoch())")
      .run(id, tableId, JSON.stringify(values));
      
    const row = db.prepare("SELECT * FROM rows WHERE id = ?").get(id) as any;
    res.status(201).json({ 
      ...row, 
      tableId: row.table_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      values: JSON.parse(row.values), 
      attachments: [] 
    });
  } catch (err) { next(err); }
});

// PATCH /tables/:tableId/rows/:rowId
rowsRouter.patch("/:rowId", (req, res, next) => {
  try {
    const { rowId } = req.params;
    const { values } = req.body;
    
    db.prepare("UPDATE rows SET \"values\" = ?, updated_at = unixepoch() WHERE id = ?")
      .run(JSON.stringify(values), rowId);
      
    const row = db.prepare("SELECT * FROM rows WHERE id = ?").get(rowId) as any;
    if (!row) return res.status(404).json({ error: "Row not found" });
    
    const atts = db.prepare("SELECT * FROM attachments WHERE row_id = ?").all(rowId) as any[];
    res.json({ 
      ...row, 
      tableId: row.table_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      values: JSON.parse(row.values), 
      attachments: atts.map(a => ({ ...a, rowId: a.row_id }))
    });
  } catch (err) { next(err); }
});

// DELETE /tables/:tableId/rows/:rowId
rowsRouter.delete("/:rowId", (req, res, next) => {
  try {
    db.prepare("DELETE FROM rows WHERE id = ?").run(req.params.rowId);
    res.status(204).end();
  } catch (err) { next(err); }
});
