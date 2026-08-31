import { Router } from "express";
import { db } from "../db/client.js";
import { nanoid } from "nanoid";

export const tablesRouter = Router();

// GET /tables
tablesRouter.get("/", (_req, res, next) => {
  try {
    const allTables = db.prepare("SELECT * FROM tables ORDER BY created_at").all() as any[];
    
    const result = allTables.map(t => {
      const props = db.prepare("SELECT * FROM properties WHERE table_id = ? ORDER BY \"order\"").all(t.id) as any[];
      const rowCountResult = db.prepare("SELECT count(*) as count FROM rows WHERE table_id = ?").get(t.id) as { count: number };
      
      return {
        id: t.id,
        name: t.name,
        description: t.description,
        color: t.color,
        pinned: Boolean(t.pinned),
        group: t.group_name || "",
        createdAt: t.created_at,
        properties: props.map(p => ({
          ...p,
          tableId: p.table_id,
          options: p.options ? JSON.parse(p.options) : undefined
        })),
        rowCount: rowCountResult.count,
      };
    });
    
    res.json(result);
  } catch (err) { next(err); }
});

// POST /tables
tablesRouter.post("/", (req, res, next) => {
  try {
    const { name, description = "", color = "#c0764a", pinned = false, group = "" } = req.body;
    if (!name) return res.status(400).json({ error: "name is required" });
    const id = nanoid();
    
    db.prepare("INSERT INTO tables (id, name, description, color, pinned, group_name) VALUES (?, ?, ?, ?, ?, ?)")
      .run(id, name, description, color, pinned ? 1 : 0, group);
      
    const table = db.prepare("SELECT * FROM tables WHERE id = ?").get(id) as any;
    
    res.status(201).json({
      ...table,
      pinned: Boolean(table.pinned),
      group: table.group_name || "",
      createdAt: table.created_at,
      properties: [],
      rowCount: 0
    });
  } catch (err) { next(err); }
});

// PATCH /tables/:id
tablesRouter.patch("/:id", (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, color, pinned, group } = req.body;
    
    const current = db.prepare("SELECT * FROM tables WHERE id = ?").get(id) as any;
    if (!current) return res.status(404).json({ error: "Table not found" });

    db.prepare(`
      UPDATE tables SET 
        name = ?, 
        description = ?, 
        color = ?, 
        pinned = ?,
        group_name = ?
      WHERE id = ?
    `).run(
      name ?? current.name,
      description ?? current.description,
      color ?? current.color,
      pinned !== undefined ? (pinned ? 1 : 0) : current.pinned,
      group ?? current.group_name,
      id
    );

    const table = db.prepare("SELECT * FROM tables WHERE id = ?").get(id) as any;
    res.json({
      ...table,
      pinned: Boolean(table.pinned),
      group: table.group_name || "",
      createdAt: table.created_at
    });
  } catch (err) { next(err); }
});

// DELETE /tables/:id
tablesRouter.delete("/:id", (req, res, next) => {
  try {
    db.prepare("DELETE FROM tables WHERE id = ?").run(req.params.id);
    res.status(204).end();
  } catch (err) { next(err); }
});
