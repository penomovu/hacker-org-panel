import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Contract status enum
export const contractStatusEnum = pgEnum("contract_status", [
  "pending",
  "reviewing",
  "accepted",
  "in_progress",
  "completed",
  "rejected",
]);

// Contract type enum
export const contractTypeEnum = pgEnum("contract_type", [
  "target_infiltration",
  "data_extraction",
  "account_takeover",
  "network_breach",
]);

// Contracts table
export const contracts = pgTable("contracts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  target: text("target").notNull(),
  type: contractTypeEnum("type").notNull(),
  details: text("details").notNull(),
  bounty: text("bounty").notNull(),
  status: contractStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertContractSchema = createInsertSchema(contracts).omit({
  id: true,
  status: true,
  createdAt: true,
  updatedAt: true,
});

export const updateContractStatusSchema = z.object({
  status: z.enum(["pending", "reviewing", "accepted", "in_progress", "completed", "rejected"]),
});

export type InsertContract = z.infer<typeof insertContractSchema>;
export type Contract = typeof contracts.$inferSelect;
export type ContractStatus = Contract["status"];
