import { type User, type InsertUser, type UserProfile, type InsertUserProfile, type EmergencyContact, type InsertEmergencyContact, type SosEvent, type InsertSosEvent, type RouteRequest, type InsertRouteRequest } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // Original user methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // User profile methods
  getUserProfile(id: string): Promise<UserProfile | undefined>;
  getUserProfileByEmail(email: string): Promise<UserProfile | undefined>;
  createUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  updateUserProfile(id: string, profile: Partial<InsertUserProfile>): Promise<UserProfile | undefined>;
  deleteUserProfile(id: string): Promise<boolean>;
  
  // Emergency contact methods
  getEmergencyContacts(userId: string): Promise<EmergencyContact[]>;
  getEmergencyContact(id: string): Promise<EmergencyContact | undefined>;
  createEmergencyContact(contact: InsertEmergencyContact): Promise<EmergencyContact>;
  updateEmergencyContact(id: string, contact: Partial<InsertEmergencyContact>): Promise<EmergencyContact | undefined>;
  deleteEmergencyContact(id: string): Promise<boolean>;
  
  // SOS event methods
  getSosEvents(userId: string): Promise<SosEvent[]>;
  getSosEvent(id: string): Promise<SosEvent | undefined>;
  createSosEvent(event: InsertSosEvent): Promise<SosEvent>;
  updateSosEvent(id: string, event: Partial<InsertSosEvent>): Promise<SosEvent | undefined>;
  
  // Route request methods
  getRouteRequests(userId: string): Promise<RouteRequest[]>;
  getRouteRequest(id: string): Promise<RouteRequest | undefined>;
  createRouteRequest(request: InsertRouteRequest): Promise<RouteRequest>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private userProfiles: Map<string, UserProfile>;
  private emergencyContacts: Map<string, EmergencyContact>;
  private sosEvents: Map<string, SosEvent>;
  private routeRequests: Map<string, RouteRequest>;

  constructor() {
    this.users = new Map();
    this.userProfiles = new Map();
    this.emergencyContacts = new Map();
    this.sosEvents = new Map();
    this.routeRequests = new Map();
  }

  // Original user methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // User profile methods
  async getUserProfile(id: string): Promise<UserProfile | undefined> {
    return this.userProfiles.get(id);
  }

  async getUserProfileByEmail(email: string): Promise<UserProfile | undefined> {
    return Array.from(this.userProfiles.values()).find(
      (profile) => profile.email === email,
    );
  }

  async createUserProfile(insertProfile: InsertUserProfile): Promise<UserProfile> {
    const id = randomUUID();
    const profile: UserProfile = { 
      ...insertProfile, 
      id,
      phone: insertProfile.phone ?? null,
      emergencyContactIds: null,
      createdAt: new Date().toISOString()
    };
    this.userProfiles.set(id, profile);
    return profile;
  }

  async updateUserProfile(id: string, updates: Partial<InsertUserProfile>): Promise<UserProfile | undefined> {
    const existing = this.userProfiles.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.userProfiles.set(id, updated);
    return updated;
  }

  async deleteUserProfile(id: string): Promise<boolean> {
    return this.userProfiles.delete(id);
  }

  // Emergency contact methods
  async getEmergencyContacts(userId: string): Promise<EmergencyContact[]> {
    return Array.from(this.emergencyContacts.values()).filter(
      (contact) => contact.userId === userId,
    );
  }

  async getEmergencyContact(id: string): Promise<EmergencyContact | undefined> {
    return this.emergencyContacts.get(id);
  }

  async createEmergencyContact(insertContact: InsertEmergencyContact): Promise<EmergencyContact> {
    const id = randomUUID();
    const contact: EmergencyContact = { 
      ...insertContact, 
      id,
      email: insertContact.email ?? null,
      priority: insertContact.priority ?? null
    };
    this.emergencyContacts.set(id, contact);
    return contact;
  }

  async updateEmergencyContact(id: string, updates: Partial<InsertEmergencyContact>): Promise<EmergencyContact | undefined> {
    const existing = this.emergencyContacts.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.emergencyContacts.set(id, updated);
    return updated;
  }

  async deleteEmergencyContact(id: string): Promise<boolean> {
    return this.emergencyContacts.delete(id);
  }

  // SOS event methods
  async getSosEvents(userId: string): Promise<SosEvent[]> {
    return Array.from(this.sosEvents.values()).filter(
      (event) => event.userId === userId,
    );
  }

  async getSosEvent(id: string): Promise<SosEvent | undefined> {
    return this.sosEvents.get(id);
  }

  async createSosEvent(insertEvent: InsertSosEvent): Promise<SosEvent> {
    const id = randomUUID();
    const event: SosEvent = { 
      ...insertEvent, 
      id,
      photoPath: insertEvent.photoPath ?? null,
      audioPath: insertEvent.audioPath ?? null,
      aiSummary: insertEvent.aiSummary ?? null,
      status: insertEvent.status ?? 'pending',
      alertsSent: 0,
      createdAt: new Date().toISOString()
    };
    this.sosEvents.set(id, event);
    return event;
  }

  async updateSosEvent(id: string, updates: Partial<InsertSosEvent>): Promise<SosEvent | undefined> {
    const existing = this.sosEvents.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.sosEvents.set(id, updated);
    return updated;
  }

  // Route request methods
  async getRouteRequests(userId: string): Promise<RouteRequest[]> {
    return Array.from(this.routeRequests.values()).filter(
      (request) => request.userId === userId,
    );
  }

  async getRouteRequest(id: string): Promise<RouteRequest | undefined> {
    return this.routeRequests.get(id);
  }

  async createRouteRequest(insertRequest: InsertRouteRequest): Promise<RouteRequest> {
    const id = randomUUID();
    const request: RouteRequest = { 
      ...insertRequest, 
      id,
      userId: insertRequest.userId ?? null,
      routeData: insertRequest.routeData ?? null,
      safetyScore: insertRequest.safetyScore ?? null,
      createdAt: new Date().toISOString()
    };
    this.routeRequests.set(id, request);
    return request;
  }
}

export const storage = new MemStorage();
