# GYMistic - Offline Islamic Fitness App

## Overview

GYMistic is an offline-first Islamic fitness application that combines physical fitness tracking with spiritual motivation. Built for Pakistani users, it features budget-conscious meal planning in PKR, workout tracking with Islamic motivational quotes, and mental wellness features including dhikr reminders and breathing exercises.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack React Query for server state, local hooks for component state
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **UI Components**: Radix UI components with shadcn/ui styling
- **Animations**: Framer Motion for smooth interactions
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **API Design**: RESTful endpoints with `/api` prefix
- **Development**: Hot module replacement via Vite middleware

### Data Storage Solutions
- **Primary Storage**: IndexedDB for offline-first data persistence
- **Database ORM**: Drizzle ORM with PostgreSQL dialect (configured but not actively used)
- **Schema**: Shared TypeScript schemas with Zod validation
- **Storage Interface**: Abstracted storage service for CRUD operations on:
  - Workout sessions and exercises
  - Body measurements and progress
  - Meal plans and nutrition tracking
  - Mood logs and mental fitness data
  - User preferences and settings

### Authentication and Authorization
- **Current State**: No authentication required (offline-first design)
- **Future Consideration**: Optional user accounts for data synchronization

## Key Components

### Workout System
- Exercise library with instructions and muscle group targeting
- Workout plan generator (Push/Pull/Legs, Bro Split, Full Body splits)
- Rep and set tracking with manual input and motion detection
- Progressive overload monitoring
- Rest timer with Islamic motivational quotes

### Nutrition Planning
- Budget-based meal planning in Pakistani Rupees
- Local food suggestions (daal, chawal, roti, etc.)
- Calorie and macro tracking
- Weekly menu rotation system
- Grocery list generation

### Mental Wellness
- Daily mood tracking with emoji-based interface
- 4-4-4 breathing exercise timer
- Islamic quote rotation with Roman Urdu and translations
- Optional dhikr reminders

### Progress Tracking
- Body measurement logging (weight, chest, waist, arms, etc.)
- BMI calculation and categorization
- Visual progress charts and trends
- Achievement milestones

## Data Flow

1. **User Interaction**: Mobile-first interface with bottom navigation
2. **Local Processing**: All data processing happens client-side
3. **IndexedDB Storage**: Persistent storage without internet dependency
4. **Background Sync**: Planned feature for optional cloud backup

## External Dependencies

### UI and Styling
- Radix UI for accessible component primitives
- Tailwind CSS for utility-first styling
- FontAwesome for iconography
- Framer Motion for animations

### Data Management
- TanStack React Query for state management
- idb for IndexedDB wrapper
- Zod for schema validation
- date-fns for date manipulation

### Development Tools
- Vite with React plugin for development
- ESBuild for production bundling
- TypeScript for type safety
- Replit-specific plugins for development environment

## Deployment Strategy

### Development
- Vite dev server with HMR
- Express server for API routes
- File-based routing with Wouter

### Production
- Static asset generation via Vite build
- Express server bundled with ESBuild
- Environment variable configuration for database connection

### Offline Strategy
- Service worker implementation planned
- IndexedDB for complete offline functionality
- Progressive Web App capabilities

## Technical Decisions

### Offline-First Approach
**Problem**: Users in Pakistan may have unreliable internet connections
**Solution**: IndexedDB-based storage with optional cloud sync
**Rationale**: Ensures app functionality regardless of connectivity

### Islamic Integration
**Problem**: Need to combine fitness with spiritual motivation
**Solution**: Islamic quotes, dhikr reminders, and culturally relevant content
**Rationale**: Addresses the target audience's values and motivation

### Budget-Conscious Design
**Problem**: Cost-effective meal planning for Pakistani users
**Solution**: PKR-based budget planning with local food suggestions
**Rationale**: Makes healthy eating accessible within local economic constraints

### Component Architecture
**Problem**: Need for reusable, accessible UI components
**Solution**: Radix UI primitives with custom styling
**Rationale**: Provides accessibility out-of-the-box while maintaining design consistency