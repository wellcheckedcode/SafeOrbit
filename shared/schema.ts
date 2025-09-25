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

// User profiles schema
export const userProfiles = pgTable("user_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  phone: text("phone"),
  emergencyContactIds: text("emergency_contact_ids").array(),
  createdAt: text("created_at").default(sql`now()`),
});

// Emergency contacts schema
export const emergencyContacts = pgTable("emergency_contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => userProfiles.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  relationship: text("relationship").notNull(),
  priority: integer("priority").default(1),
});

// SOS events schema

// SOS events schema
export const sosEvents = pgTable("sos_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => userProfiles.id, { onDelete: "cascade" }),
  lat: decimal("lat", { precision: 10, scale: 7 }).notNull(),
  lng: decimal("lng", { precision: 10, scale: 7 }).notNull(),
  photoPath: text("photo_path"),
  audioPath: text("audio_path"),
  aiSummary: text("ai_summary"),
  status: text("status").notNull().default('pending'),
  alertsSent: integer("alerts_sent").default(0),
  createdAt: text("created_at").default(sql`now()`),
});

// Route requests schema
export const routeRequests = pgTable("route_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => userProfiles.id, { onDelete: "cascade" }),
  originLat: decimal("origin_lat", { precision: 10, scale: 7 }).notNull(),
  originLng: decimal("origin_lng", { precision: 10, scale: 7 }).notNull(),
  destLat: decimal("dest_lat", { precision: 10, scale: 7 }).notNull(),
  destLng: decimal("dest_lng", { precision: 10, scale: 7 }).notNull(),
  routeData: text("route_data"),
  safetyScore: integer("safety_score"),
  createdAt: text("created_at").default(sql`now()`),
});

// Insert schemas
export const insertUserProfileSchema = createInsertSchema(userProfiles).pick({
  name: true,
  email: true,
  password: true,
  phone: true,
});

export const insertEmergencyContactSchema = createInsertSchema(emergencyContacts).pick({
  userId: true,
  name: true,
  phone: true,
  email: true,
  relationship: true,
  priority: true,
});

export const insertSosEventSchema = createInsertSchema(sosEvents).pick({
  userId: true,
  lat: true,
  lng: true,
  photoPath: true,
  audioPath: true,
  aiSummary: true,
  status: true,
});

export const insertRouteRequestSchema = createInsertSchema(routeRequests).pick({
  userId: true,
  originLat: true,
  originLng: true,
  destLat: true,
  destLng: true,
  routeData: true,
  safetyScore: true,
});

// Types
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type UserProfile = typeof userProfiles.$inferSelect;

export type InsertEmergencyContact = z.infer<typeof insertEmergencyContactSchema>;
export type EmergencyContact = typeof emergencyContacts.$inferSelect;

export type InsertSosEvent = z.infer<typeof insertSosEventSchema>;
export type SosEvent = typeof sosEvents.$inferSelect;

export type InsertRouteRequest = z.infer<typeof insertRouteRequestSchema>;
export type RouteRequest = typeof routeRequests.$inferSelect;

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

// SOS status enum
export const sosStatuses = ['pending', 'processing', 'completed', 'failed'] as const;
export type SosStatus = typeof sosStatuses[number];

// Relationship types for emergency contacts
export const relationshipTypes = ['Parent', 'Spouse', 'Sibling', 'Child', 'Friend', 'Other'] as const;
export type RelationshipType = typeof relationshipTypes[number];
