import { Router } from "express";
import { db } from "../db/client.js";
import { nanoid } from "nanoid";

export const propertiesRouter = Router({ mergeParams: true });

// GET /tables/:tableId/properties
propertiesRouter.get("/", (req, res, next) => {
  try {
    const { tableId } = req.params as { tableId: string };
    const props = db.prepare("SELECT * FROM properties WHERE table_id = ? ORDER BY \"order\"").all(tableId) as any[];
    res.json(props.map(p => ({ 
      ...p, 
      tableId: p.table_id,
      options: p.options ? JSON.parse(p.options) : undefined 
    })));
  } catch (err) { next(err); }
});

// POST /tables/:tableId/properties
propertiesRouter.post("/", (req, res, next) => {
  try {
    const { tableId } = req.params as { tableId: string };
    const { name, type, color = "#c0764a", options, order = 0 } = req.body;
    if (!name || !type) return res.status(400).json({ error: "name and type are required" });
    const id = nanoid();
    
    db.prepare(`
      INSERT INTO properties (id, table_id, name, type, color, options, \"order\")
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, tableId, name, type, color, options ? JSON.stringify(options) : null, order);
    
    const prop = db.prepare("SELECT * FROM properties WHERE id = ?").get(id) as any;
    res.status(201).json({ 
      ...prop, 
      tableId: prop.table_id,
      options: prop.options ? JSON.parse(prop.options) : undefined 
    });
  } catch (err) { next(err); }
});

// PATCH /tables/:tableId/properties/:propertyId
propertiesRouter.patch("/:propertyId", (req, res, next) => {
  try {
    const { propertyId } = req.params;
    const { name, type, color, options, order } = req.body;
    
    const current = db.prepare("SELECT * FROM properties WHERE id = ?").get(propertyId) as any;
    if (!current) return res.status(404).json({ error: "Property not found" });

    db.prepare(`
      UPDATE properties SET 
        name = ?, 
        type = ?, 
        color = ?, 
        options = ?, 
        \"order\" = ?
      WHERE id = ?
    `).run(
      name ?? current.name,
      type ?? current.type,
      color ?? current.color,
      options !== undefined ? JSON.stringify(options) : current.options,
      order !== undefined ? order : current.order,
      propertyId
    );

    const prop = db.prepare("SELECT * FROM properties WHERE id = ?").get(propertyId) as any;
    res.json({ 
      ...prop, 
      tableId: prop.table_id,
      options: prop.options ? JSON.parse(prop.options) : undefined 
    });
  } catch (err) { next(err); }
});

// DELETE /tables/:tableId/properties/:propertyId
propertiesRouter.delete("/:propertyId", (req, res, next) => {
  try {
    db.prepare("DELETE FROM properties WHERE id = ?").run(req.params.propertyId);
    res.status(204).end();
  } catch (err) { next(err); }
});
