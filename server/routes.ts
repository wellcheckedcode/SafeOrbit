import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserProfileSchema, insertEmergencyContactSchema, insertSosEventSchema, insertRouteRequestSchema } from "@shared/schema";
import { analyzeEmergencyImage } from "./gemini";

export async function registerRoutes(app: Express): Promise<Server> {
  // User Profile routes
  app.get('/api/profiles/:id', async (req, res) => {
    try {
      const profile = await storage.getUserProfile(req.params.id);
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }
      res.json(profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
      res.status(500).json({ error: 'Failed to fetch profile' });
    }
  });

  app.post('/api/profiles', async (req, res) => {
    try {
      const validatedData = insertUserProfileSchema.parse(req.body);
      const profile = await storage.createUserProfile(validatedData);
      res.status(201).json(profile);
    } catch (error) {
      console.error('Error creating profile:', error);
      res.status(400).json({ error: 'Invalid profile data' });
    }
  });

  app.put('/api/profiles/:id', async (req, res) => {
    try {
      const validatedData = insertUserProfileSchema.partial().parse(req.body);
      const profile = await storage.updateUserProfile(req.params.id, validatedData);
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }
      res.json(profile);
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(400).json({ error: 'Invalid profile data' });
    }
  });

  // Emergency Contacts routes
  app.get('/api/profiles/:userId/contacts', async (req, res) => {
    try {
      const contacts = await storage.getEmergencyContacts(req.params.userId);
      res.json(contacts);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      res.status(500).json({ error: 'Failed to fetch contacts' });
    }
  });

  app.post('/api/emergency-contacts', async (req, res) => {
    try {
      const validatedData = insertEmergencyContactSchema.parse(req.body);
      const contact = await storage.createEmergencyContact(validatedData);
      res.status(201).json(contact);
    } catch (error) {
      console.error('Error creating contact:', error);
      res.status(400).json({ error: 'Invalid contact data' });
    }
  });

  app.put('/api/contacts/:id', async (req, res) => {
    try {
      const validatedData = insertEmergencyContactSchema.partial().parse(req.body);
      const contact = await storage.updateEmergencyContact(req.params.id, validatedData);
      if (!contact) {
        return res.status(404).json({ error: 'Contact not found' });
      }
      res.json(contact);
    } catch (error) {
      console.error('Error updating contact:', error);
      res.status(400).json({ error: 'Invalid contact data' });
    }
  });

  app.delete('/api/contacts/:id', async (req, res) => {
    try {
      const deleted = await storage.deleteEmergencyContact(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: 'Contact not found' });
      }
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting contact:', error);
      res.status(500).json({ error: 'Failed to delete contact' });
    }
  });

  // SOS Events routes
  app.post('/api/sos/trigger', async (req, res) => {
    try {
      const validatedData = insertSosEventSchema.parse(req.body);
      
      // Create SOS event in storage
      const sosEvent = await storage.createSosEvent(validatedData);
      
      // Analyze emergency image using Gemini AI
      let aiAnalysis = 'Emergency situation detected';
      try {
        if (validatedData.photoData) {
          const analysisResult = await analyzeEmergencyImage(validatedData.photoData);
          aiAnalysis = analysisResult || 'Emergency situation detected';
        }
      } catch (aiError) {
        console.error('AI analysis error:', aiError);
        // Continue with default analysis
      }
      
      // Get emergency contacts for the user
      const emergencyContacts = await storage.getEmergencyContacts(validatedData.userId);
      
      // TODO: Send SMS/email alerts to emergency contacts
      // For now, we'll log the alert details
      console.log('EMERGENCY ALERT:', {
        sosEventId: sosEvent.id,
        location: { lat: validatedData.latitude, lng: validatedData.longitude },
        aiAnalysis,
        contactsToAlert: emergencyContacts.length
      });
      
      res.status(201).json({
        ...sosEvent,
        aiAnalysis,
        contactsAlerted: emergencyContacts.length
      });
    } catch (error) {
      console.error('Error processing SOS:', error);
      res.status(500).json({ error: 'Failed to process emergency request' });
    }
  });

  app.get('/api/profiles/:userId/sos-events', async (req, res) => {
    try {
      const events = await storage.getSosEvents(req.params.userId);
      res.json(events);
    } catch (error) {
      console.error('Error fetching SOS events:', error);
      res.status(500).json({ error: 'Failed to fetch SOS events' });
    }
  });

  // Route Planning routes
  app.post('/api/routes/plan', async (req, res) => {
    try {
      const validatedData = insertRouteRequestSchema.parse(req.body);
      
      // Store the route request
      const routeRequest = await storage.createRouteRequest(validatedData);
      
      // TODO: Implement actual route planning with safety considerations
      // For now, return mock data with some safety calculations
      const mockRouteData = {
        distance: '5.2 km',
        estimatedTime: '12 mins',
        safetyScore: Math.floor(Math.random() * 30) + 70, // 70-100 range
        routeId: routeRequest.id
      };
      
      res.json(mockRouteData);
    } catch (error) {
      console.error('Error creating route request:', error);
      res.status(400).json({ error: 'Invalid route data' });
    }
  });

  // Crime data endpoint (existing functionality)
  app.get('/api/crimes', async (req, res) => {
    try {
      const { allCrimeData } = await import('../client/src/data/mockCrimeData');
      res.json(allCrimeData);
    } catch (error) {
      console.error('Error fetching crimes:', error);
      res.status(500).json({ error: 'Failed to fetch crime data' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
