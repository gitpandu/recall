import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { migrate } from "./db/client.js";
import { router } from "./routes/index.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { UPLOADS_DIR } from "./lib/storage.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FRONTEND_DIST = path.resolve(__dirname, "../../frontend/dist");

const PORT = process.env.PORT ?? 3000;

await migrate();

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL ?? "http://localhost:5173" }));
app.use(express.json());
app.use("/uploads", express.static(UPLOADS_DIR));
app.use("/api", router);

// Serve frontend static files
app.use(express.static(FRONTEND_DIST));

// Handle client-side routing - redirect all non-API requests to index.html
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api") || req.path.startsWith("/uploads")) {
    return next();
  }
  res.sendFile(path.join(FRONTEND_DIST, "index.html"));
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
