import { Router } from "express";
import { db } from "../db/client.js";
import { upload, deleteFile } from "../lib/storage.js";
import { nanoid } from "nanoid";

export const attachmentsRouter = Router({ mergeParams: true });

// GET /rows/:rowId/attachments
attachmentsRouter.get("/", (req, res, next) => {
  try {
    const { rowId } = req.params as { rowId: string };
    const atts = db.prepare("SELECT * FROM attachments WHERE row_id = ?").all(rowId) as any[];
    res.json(atts.map(a => ({ ...a, rowId: a.row_id })));
  } catch (err) { next(err); }
});

// POST /rows/:rowId/attachments
attachmentsRouter.post("/", upload.single("file"), (req, res, next) => {
  try {
    const { rowId } = req.params as { rowId: string };
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });
    const id = nanoid();
    const url = `/uploads/${file.filename}`;
    
    db.prepare("INSERT INTO attachments (id, row_id, name, filename, url) VALUES (?, ?, ?, ?, ?)")
      .run(id, rowId, file.originalname, file.filename, url);
      
    const att = db.prepare("SELECT * FROM attachments WHERE id = ?").get(id) as any;
    res.status(201).json({ ...att, rowId: att.row_id });
  } catch (err) { next(err); }
});

// DELETE /rows/:rowId/attachments/:attachmentId
attachmentsRouter.delete("/:attachmentId", (req, res, next) => {
  try {
    const att = db.prepare("SELECT * FROM attachments WHERE id = ?").get(req.params.attachmentId) as any;
    if (!att) return res.status(404).json({ error: "Attachment not found" });
    
    deleteFile(att.filename);
    db.prepare("DELETE FROM attachments WHERE id = ?").run(att.id);
    res.status(204).end();
  } catch (err) { next(err); }
});
