# SafeZone Mapper

## Overview

SafeZone Mapper is a crime data visualization web application built for Lucknow, India. The platform provides users with interactive maps showing crime incidents, safety scores, and route planning capabilities. Users can view real-time crime data, assess safety levels for different areas, plan safer routes, and access emergency features including SOS alerts with family notifications.

The application combines geospatial data visualization with user safety features, offering a comprehensive tool for understanding and navigating urban safety concerns.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript running on Vite for fast development and building
- **Routing**: Wouter for lightweight client-side routing with pages for Landing, Navigate, Current Location, SOS, Profile Creation, and Crime Map
- **UI Components**: Radix UI primitives with shadcn/ui design system for consistent, accessible components
- **Styling**: Tailwind CSS with custom design tokens following Material Design principles
- **Maps**: Leaflet integration for interactive crime data visualization with custom markers and overlays
- **State Management**: TanStack Query for server state management and React hooks for local state
- **Forms**: React Hook Form with Zod validation for type-safe form handling

### Backend Architecture
- **Runtime**: Node.js with Express.js server framework
- **Language**: TypeScript with ES modules for modern JavaScript features
- **API Design**: RESTful endpoints for user profiles, emergency contacts, SOS events, and route requests
- **Database ORM**: Drizzle ORM with PostgreSQL dialect for type-safe database operations
- **File Storage**: In-memory storage implementation with interface for easy database migration
- **AI Integration**: Google Gemini AI for emergency image analysis (with mock fallback)

### Data Storage Solutions
- **Database**: PostgreSQL configured through Drizzle ORM with planned Neon Database integration
- **Schema Design**: Normalized tables for users, crime incidents, user profiles, emergency contacts, SOS events, and route requests
- **Migration System**: Drizzle Kit for database schema migrations and version control
- **Data Types**: Strong typing with Zod schemas for runtime validation and type inference

### Authentication and Authorization
- **Architecture**: Session-based authentication prepared with user profile management
- **User Management**: Complete CRUD operations for user profiles and emergency contacts
- **Security**: Input validation using Zod schemas and TypeScript type safety
- **Profile System**: Comprehensive user profiles with emergency contact management and relationship tracking

### Crime Data and Safety Features
- **Data Model**: Crime incidents with severity ratings, location coordinates, types, and descriptions
- **Safety Scoring**: Dynamic safety score calculation based on crime density and severity within map bounds
- **Filtering System**: Multi-dimensional filtering by crime type, date range, and geographic bounds
- **Visualization**: Color-coded safety zones with interactive crime markers and detailed popups

### Emergency Features
- **SOS System**: Multi-step emergency alert system with location capture and media recording
- **Emergency Contacts**: Prioritized contact management with relationship tracking
- **Route Safety**: Route planning with safety score integration for safer navigation
- **Location Services**: Geolocation integration for real-time position tracking

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection for production deployment
- **@google/genai**: Google Gemini AI integration for emergency image analysis
- **@tanstack/react-query**: Advanced server state management and caching
- **leaflet**: Interactive mapping library with custom marker and overlay support

### UI and Styling
- **@radix-ui/***: Complete suite of accessible UI primitives (dialogs, dropdowns, forms, etc.)
- **tailwindcss**: Utility-first CSS framework with custom design system integration
- **class-variance-authority**: Component variant management for consistent styling
- **lucide-react**: Icon library providing consistent iconography throughout the application

### Development and Build Tools
- **vite**: Modern build tool and development server with React plugin support
- **drizzle-kit**: Database schema management and migration tooling
- **tsx**: TypeScript execution environment for server-side development
- **wouter**: Lightweight routing library for single-page application navigation

### Data Validation and Forms
- **zod**: Runtime type validation and schema definition
- **react-hook-form**: Performant forms with built-in validation
- **@hookform/resolvers**: Integration between React Hook Form and Zod validation

### Geospatial and Media
- **@types/leaflet**: TypeScript definitions for Leaflet mapping library
- **date-fns**: Date manipulation and formatting utilities
- **connect-pg-simple**: PostgreSQL session store for user authentication