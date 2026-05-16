import { Router } from "express";
import { eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { attachments } from "../db/schema.js";
import { upload, deleteFile } from "../lib/storage.js";
import { nanoid } from "nanoid";

export const attachmentsRouter = Router({ mergeParams: true });

// GET /rows/:rowId/attachments
attachmentsRouter.get("/", async (req, res, next) => {
  try {
    const { rowId } = req.params as { rowId: string };
    const atts = await db.select().from(attachments).where(eq(attachments.rowId, rowId));
    res.json(atts);
  } catch (err) { next(err); }
});

// POST /rows/:rowId/attachments
attachmentsRouter.post("/", upload.single("file"), async (req, res, next) => {
  try {
    const { rowId } = req.params as { rowId: string };
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });
    const id = nanoid();
    const url = `/uploads/${file.filename}`;
    await db.insert(attachments).values({ id, rowId, name: file.originalname, filename: file.filename, url });
    const att = await db.select().from(attachments).where(eq(attachments.id, id)).then(r => r[0]);
    res.status(201).json(att);
  } catch (err) { next(err); }
});

// DELETE /rows/:rowId/attachments/:attachmentId
attachmentsRouter.delete("/:attachmentId", async (req, res, next) => {
  try {
    const att = await db.select().from(attachments).where(eq(attachments.id, req.params.attachmentId)).then(r => r[0]);
    if (!att) return res.status(404).json({ error: "Attachment not found" });
    deleteFile(att.filename);
    await db.delete(attachments).where(eq(attachments.id, att.id));
    res.status(204).end();
  } catch (err) { next(err); }
});
