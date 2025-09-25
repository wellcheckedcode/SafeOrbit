# SafeOrbit Design Guidelines

## Design Approach
**Selected Approach:** Design System (Material Design inspired)
**Justification:** This is a utility-focused application prioritizing data visualization, map interaction, and functional clarity. Users need to quickly assess safety information and navigate efficiently.

## Core Design Elements

### Color Palette
**Primary Colors:**
- Primary: 220 85% 45% (Deep blue for headers, primary actions)
- Primary Light: 220 75% 55% (Hover states, secondary elements)

**Safety Score Colors:**
- Safe: 120 60% 45% (Green for low crime areas)
- Moderate: 45 75% 55% (Amber for medium crime areas)  
- Unsafe: 0 75% 50% (Red for high crime areas)

**Neutral Colors:**
- Background: 0 0% 98% (Light gray background)
- Surface: 0 0% 100% (White cards and panels)
- Text Primary: 0 0% 15% (Dark gray for main text)
- Text Secondary: 0 0% 45% (Medium gray for secondary text)
- Border: 0 0% 88% (Light gray borders)

### Typography
- **Primary Font:** Inter (Google Fonts)
- **Headings:** Font weights 600-700, sizes from text-lg to text-3xl
- **Body Text:** Font weight 400-500, sizes text-sm to text-base
- **Map Labels:** Font weight 500, text-xs to text-sm for markers and overlays

### Layout System
**Spacing Units:** Consistent use of Tailwind units 2, 4, 6, 8, 12, 16
- **Micro spacing:** p-2, m-2 for tight elements
- **Standard spacing:** p-4, m-4 for general layout
- **Section spacing:** p-6, m-6 for component separation
- **Large spacing:** p-8, m-8 for major layout sections

### Component Library

**Header Navigation:**
- Fixed top navigation with search bar, logo, and filter controls
- Height: h-16, background: white with subtle shadow
- Search bar: Full-width on mobile, constrained on desktop

**Map Container:**
- Primary viewport area taking remaining screen height
- Leaflet integration with custom marker styling
- Overlay panels for safety scores and crime details

**Safety Score Panel:**
- Floating card positioned over map (top-right on desktop, bottom on mobile)
- Rounded corners, white background, subtle shadow
- Real-time updates with smooth transitions

**Crime Markers:**
- Circular markers with color-coded severity levels
- Size variations based on zoom level
- Hover states with tooltip previews

**Filter Controls:**
- Horizontal tabs or dropdown for crime type filtering
- Toggle switches for severity ranges
- Clear visual feedback for active filters

**Popup Details:**
- Modal or card-style popups for crime information
- Clean typography hierarchy with date, type, severity, and description
- Easy close/dismiss interactions

### Responsive Design
- **Mobile-first approach** with map as primary interface
- **Collapsible panels** for filters and safety scores on small screens
- **Touch-friendly interactions** for map navigation and marker selection
- **Adaptive search bar** that expands/collapses appropriately

### Interactive Elements
- **Subtle hover effects** on clickable elements
- **Smooth map transitions** when searching or filtering
- **Loading states** for search and data fetching
- **Clear visual feedback** for user actions

This design prioritizes clarity, efficiency, and data accessibility while maintaining a clean, professional appearance suitable for a safety-focused utility application.