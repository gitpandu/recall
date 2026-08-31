import { Router } from "express";
import { tablesRouter } from "./tables.js";
import { propertiesRouter } from "./properties.js";
import { rowsRouter } from "./rows.js";
import { attachmentsRouter } from "./attachments.js";

export const router = Router();

router.use("/tables", tablesRouter);
router.use("/tables/:tableId/properties", propertiesRouter);
router.use("/tables/:tableId/rows", rowsRouter);
router.use("/rows/:rowId/attachments", attachmentsRouter);
