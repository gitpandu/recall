import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const tables = sqliteTable("tables", {
  id:          text("id").primaryKey(),
  name:        text("name").notNull(),
  description: text("description").notNull().default(""),
  color:       text("color").notNull().default("#c0764a"),
  createdAt:   integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const properties = sqliteTable("properties", {
  id:      text("id").primaryKey(),
  tableId: text("table_id").notNull().references(() => tables.id, { onDelete: "cascade" }),
  name:    text("name").notNull(),
  type:    text("type").notNull(),
  color:   text("color").notNull().default("#c0764a"),
  options: text("options"),
  order:   integer("order").notNull().default(0),
});

export const rows = sqliteTable("rows", {
  id:        text("id").primaryKey(),
  tableId:   text("table_id").notNull().references(() => tables.id, { onDelete: "cascade" }),
  values:    text("values").notNull().default("{}"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const attachments = sqliteTable("attachments", {
  id:       text("id").primaryKey(),
  rowId:    text("row_id").notNull().references(() => rows.id, { onDelete: "cascade" }),
  name:     text("name").notNull(),
  filename: text("filename").notNull(),
  url:      text("url").notNull(),
});
