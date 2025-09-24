import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
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

// Crime incident schema
export const crimeIncidents = pgTable("crime_incidents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  lat: decimal("lat", { precision: 10, scale: 7 }).notNull(),
  lng: decimal("lng", { precision: 10, scale: 7 }).notNull(),
  type: text("type").notNull(),
  severity: integer("severity").notNull(),
  date: text("date").notNull(),
  description: text("description").notNull(),
});

export const insertCrimeIncidentSchema = createInsertSchema(crimeIncidents).pick({
  lat: true,
  lng: true,
  type: true,
  severity: true,
  date: true,
  description: true,
});

export type InsertCrimeIncident = z.infer<typeof insertCrimeIncidentSchema>;
export type CrimeIncident = typeof crimeIncidents.$inferSelect;

// Crime type enum for filtering
export const crimeTypes = ['Theft', 'Assault', 'Burglary', 'Vandalism', 'Robbery'] as const;
export type CrimeType = typeof crimeTypes[number];

// Date range options for filtering
export const dateRanges = ['Last 30 days', 'Last 6 months', 'All Time'] as const;
export type DateRange = typeof dateRanges[number];

// Safety score calculation types
export interface SafetyScore {
  score: number;
  level: 'Very Safe' | 'Safe' | 'Moderate' | 'Use Caution' | 'High Risk';
  color: 'safe' | 'moderate' | 'unsafe';
}
