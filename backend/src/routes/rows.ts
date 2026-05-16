import { Router } from "express";
import { eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { rows, attachments } from "../db/schema.js";
import { nanoid } from "nanoid";

export const rowsRouter = Router({ mergeParams: true });

// GET /tables/:tableId/rows
rowsRouter.get("/", async (req, res, next) => {
  try {
    const { tableId } = req.params as { tableId: string };
    const allRows = await db.select().from(rows).where(eq(rows.tableId, tableId)).orderBy(rows.createdAt);
    const result = await Promise.all(allRows.map(async r => {
      const atts = await db.select().from(attachments).where(eq(attachments.rowId, r.id));
      return { ...r, tableId: r.tableId, values: JSON.parse(r.values), attachments: atts };
    }));
    res.json(result);
  } catch (err) { next(err); }
});

// POST /tables/:tableId/rows
rowsRouter.post("/", async (req, res, next) => {
  try {
    const { tableId } = req.params as { tableId: string };
    const { values = {} } = req.body;
    const id = nanoid();
    await db.insert(rows).values({ id, tableId, values: JSON.stringify(values) });
    const row = await db.select().from(rows).where(eq(rows.id, id)).then(r => r[0]);
    res.status(201).json({ ...row, values: JSON.parse(row.values), attachments: [] });
  } catch (err) { next(err); }
});

// PATCH /tables/:tableId/rows/:rowId
rowsRouter.patch("/:rowId", async (req, res, next) => {
  try {
    const { rowId } = req.params;
    const { values } = req.body;
    await db.update(rows).set({ values: JSON.stringify(values), updatedAt: new Date() }).where(eq(rows.id, rowId));
    const row = await db.select().from(rows).where(eq(rows.id, rowId)).then(r => r[0]);
    if (!row) return res.status(404).json({ error: "Row not found" });
    const atts = await db.select().from(attachments).where(eq(attachments.rowId, rowId));
    res.json({ ...row, values: JSON.parse(row.values), attachments: atts });
  } catch (err) { next(err); }
});

// DELETE /tables/:tableId/rows/:rowId
rowsRouter.delete("/:rowId", async (req, res, next) => {
  try {
    await db.delete(rows).where(eq(rows.id, req.params.rowId));
    res.status(204).end();
  } catch (err) { next(err); }
});
