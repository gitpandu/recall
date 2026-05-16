import { Router } from "express";
import { eq, sql } from "drizzle-orm";
import { db } from "../db/client.js";
import { tables, properties, rows } from "../db/schema.js";
import { nanoid } from "nanoid";

export const tablesRouter = Router();

// GET /tables
tablesRouter.get("/", async (_req, res, next) => {
  try {
    const all = await db.select().from(tables).orderBy(tables.createdAt);
    const result = await Promise.all(all.map(async t => {
      const props = await db.select().from(properties).where(eq(properties.tableId, t.id)).orderBy(properties.order);
      const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(rows).where(eq(rows.tableId, t.id));
      return {
        ...t,
        properties: props.map(p => ({ ...p, options: p.options ? JSON.parse(p.options) : undefined })),
        rowCount: count,
      };
    }));
    res.json(result);
  } catch (err) { next(err); }
});

// POST /tables
tablesRouter.post("/", async (req, res, next) => {
  try {
    const { name, description = "", color = "#c0764a", pinned = false } = req.body;
    if (!name) return res.status(400).json({ error: "name is required" });
    const id = nanoid();
    await db.insert(tables).values({ id, name, description, color, pinned });
    const table = await db.select().from(tables).where(eq(tables.id, id)).then(r => r[0]);
    res.status(201).json({ ...table, properties: [], rowCount: 0 });
  } catch (err) { next(err); }
});

// PATCH /tables/:id
tablesRouter.patch("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, color, pinned } = req.body;
    await db.update(tables).set({
      ...(name && { name }),
      ...(description !== undefined && { description }),
      ...(color && { color }),
      ...(pinned !== undefined && { pinned }),
    }).where(eq(tables.id, id));
    const table = await db.select().from(tables).where(eq(tables.id, id)).then(r => r[0]);
    if (!table) return res.status(404).json({ error: "Table not found" });
    res.json(table);
  } catch (err) { next(err); }
});

// DELETE /tables/:id
tablesRouter.delete("/:id", async (req, res, next) => {
  try {
    await db.delete(tables).where(eq(tables.id, req.params.id));
    res.status(204).end();
  } catch (err) { next(err); }
});
