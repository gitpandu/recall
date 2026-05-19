import express from "express";
import cors from "cors";
import { migrate } from "./db/client.js";
import { router } from "./routes/index.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { UPLOADS_DIR } from "./lib/storage.js";

const PORT = process.env.PORT ?? 3000;

await migrate();

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL ?? "http://localhost:5173" }));
app.use(express.json());
app.use("/uploads", express.static(UPLOADS_DIR));
app.use("/api", router);
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
