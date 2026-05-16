import { Router } from "express";
import { eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { properties } from "../db/schema.js";
import { nanoid } from "nanoid";

export const propertiesRouter = Router({ mergeParams: true });

// GET /tables/:tableId/properties
propertiesRouter.get("/", async (req, res, next) => {
  try {
    const { tableId } = req.params as { tableId: string };
    const props = await db.select().from(properties).where(eq(properties.tableId, tableId)).orderBy(properties.order);
    res.json(props.map(p => ({ ...p, options: p.options ? JSON.parse(p.options) : undefined })));
  } catch (err) { next(err); }
});

// POST /tables/:tableId/properties
propertiesRouter.post("/", async (req, res, next) => {
  try {
    const { tableId } = req.params as { tableId: string };
    const { name, type, color = "#c0764a", options, order = 0 } = req.body;
    if (!name || !type) return res.status(400).json({ error: "name and type are required" });
    const id = nanoid();
    await db.insert(properties).values({ id, tableId, name, type, color, options: options ? JSON.stringify(options) : null, order });
    const prop = await db.select().from(properties).where(eq(properties.id, id)).then(r => r[0]);
    res.status(201).json({ ...prop, options: prop.options ? JSON.parse(prop.options) : undefined });
  } catch (err) { next(err); }
});

// PATCH /tables/:tableId/properties/:propertyId
propertiesRouter.patch("/:propertyId", async (req, res, next) => {
  try {
    const { propertyId } = req.params;
    const { name, type, color, options, order } = req.body;
    await db.update(properties).set({
      ...(name && { name }),
      ...(type && { type }),
      ...(color && { color }),
      ...(options !== undefined && { options: JSON.stringify(options) }),
      ...(order !== undefined && { order }),
    }).where(eq(properties.id, propertyId));
    const prop = await db.select().from(properties).where(eq(properties.id, propertyId)).then(r => r[0]);
    if (!prop) return res.status(404).json({ error: "Property not found" });
    res.json({ ...prop, options: prop.options ? JSON.parse(prop.options) : undefined });
  } catch (err) { next(err); }
});

// DELETE /tables/:tableId/properties/:propertyId
propertiesRouter.delete("/:propertyId", async (req, res, next) => {
  try {
    await db.delete(properties).where(eq(properties.id, req.params.propertyId));
    res.status(204).end();
  } catch (err) { next(err); }
});
