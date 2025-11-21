Project Overview
This is a Wi-Fi and network management platform built with React. It provides enterprise, hotel, PG, and co-living/co-working network management, device assignment, analytics, user policies, and reporting.

Technologies Used
React (functional components, hooks)

JavaScript (ES6+), some files use TypeScript conventions

Chart.js for analytics/visualizations

CSS Modules

React Icons

Redux-style state handling in some modules

Modular and lazy-loaded routes

Key Folders and Files
src/components/ — UI components (Badge, Button, Card, layouts, etc.)

src/pages/ — Main application screens (Dashboard, User Management, Device List, Reports, Knowledge Center)

src/config/ — Centralized configuration (Chart config, route definitions, report definitions, policy and device configuration)

src/constants/ — Application-wide constants and sample/mock data

src/hooks/ — Custom React hooks for permissions, filters, table state, and sorting

src/utils/ — Utility functions for exporting, formatting, and calculations

src/assets/ — Images and static files

Main Business Logic
User, device, and policy management via forms and lists.

MAC address validation and vendor/OUI lookup for device registration.

Role-based access control for fine-grained permissions (admin, manager, network admin, viewer).

Multiple user segments (Enterprise, Co-Living, PG, Hotel, Misc) with segment-specific device and policy constraints.

Analytics: Usage, license, device stats, and alert reporting with charts and export utilities.

Coding Standards / Conventions
Arrow functions, prop-types for some components.

Constants and configs are centralized for maintainability.

Strong use of composition in UI (e.g., Card, Badge, Button).

CSS variables and responsive design breakpoints.

Components expect robust prop passing (use defaultProps).

Use of lazy loading (React.lazy) for routes.

Known Issues / TODOs
Todo: Backend integration for real-time MAC validation.

Potential edge cases: Device registration in segments with constraints.

Refactor: Some forms (especially PaymentForm) for modularity and error handling.

Optimize: Product fetching logic for performance.

Large reports and data exports may require streaming/API pagination.

Strengthen TypeScript typing if migrating fully.

Special Notes
Test all user & device flows for each segment type.

Check RBAC rules on any permission changes.

CLAUDE.local.md is supported for personal context.