# Wi-Fi Management Portal

A comprehensive, segment-aware Wi-Fi and network management platform built with React. This portal provides enterprise-grade network management, device assignment, analytics, user policies, and reporting tailored to different business segments.

## Overview

This platform supports multiple business segments with tailored experiences:
- **Enterprise**: Corporate user management, department policies, compliance reporting
- **Co-Living**: Resident onboarding, tiered internet plans, occupancy management
- **Hotel**: Guest WiFi access, PMS integration, automatic check-out
- **Coworking**: Member management, day passes, flexible plans
- **PG (Paying Guest)**: Tenant management, cost-effective plans, fair bandwidth distribution
- **Miscellaneous**: General WiFi management for all other use cases

## Key Features

### Segment-Aware Architecture
- Automatic content adaptation based on current business segment
- Tailored terminology, workflows, and policies per segment
- Seamless segment switching with instant UI updates

### User Management
- Role-based access control (Admin, Manager, Network Admin, Viewer)
- Bulk user operations (CSV import/export)
- User status management (Active, Suspended, Blocked, Expired)
- Segment-specific user policies and licensing

### Device Management
- MAC address validation and vendor/OUI lookup
- Segment-specific device registration and constraints
- Device type restrictions and limits per segment
- Bulk device operations

### Network Configuration
- Policy setup and configuration per segment
- Tiered internet plans and bandwidth management
- License capacity management
- Advanced network settings

### Analytics & Reporting
- Usage analytics with customizable date ranges
- License utilization tracking
- Device statistics and alerts
- Export capabilities (CSV, PDF)
- Segment-specific metrics

### Knowledge Center
The Knowledge Center provides segment-aware documentation, video tutorials, and FAQs:

#### Uniform Video Topics (6 videos per segment)
All segments follow a consistent structure with 6 core video topics:

1. **Getting Started** - Segment-specific onboarding and setup
2. **User Management** - Managing users/members/guests/residents/tenants
3. **Device Registration** - Device registration and management process
4. **Policy Setup** - Configuring policies, plans, and network settings
5. **Reports & Analytics** - Generating reports and viewing analytics
6. **Troubleshooting** - Common issues and solutions

#### Video Organization
Videos are organized by segment in the following structure:

```
public/assets/videos/
├── enterprise/
│   ├── getting-started.mp4
│   ├── user-management.mp4
│   ├── device-registration.mp4
│   ├── policy-setup.mp4
│   ├── reports.mp4
│   └── troubleshooting.mp4
├── coLiving/
│   └── [same 6 videos]
├── hotel/
│   └── [same 6 videos]
├── coWorking/
│   └── [same 6 videos]
├── pg/
│   └── [same 6 videos]
└── miscellaneous/
    └── [same 6 videos]
```

**Video Requirements:**
- Format: MP4 (H.264/AAC) recommended
- Resolution: 1280x720 (720p) or 1920x1080 (1080p)
- Aspect Ratio: 16:9
- File Size: Keep under 50MB for optimal loading
- Duration: 5-15 minutes recommended

For detailed video documentation, see: `public/assets/videos/README.md`

#### Segment-Specific Articles
- 10-24 articles per segment with tailored content
- Screenshot placeholders for step-by-step guides
- Quick Start Guides covering essential workflows
- Advanced configuration guides

#### Segment-Specific FAQs
- 5-10 FAQs per segment addressing segment-specific concerns
- Troubleshooting guides
- Best practices

## Technologies Used

- **React** 18+ (functional components, hooks)
- **JavaScript ES6+**
- **Chart.js** for analytics visualizations
- **CSS Modules** and CSS Variables for styling
- **React Icons** for iconography
- **React Toastify** for notifications
- **Custom Hooks** for permissions, filters, table state
- **Modular & Lazy-Loaded Routes** for code splitting

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Badge.js
│   ├── Button.js
│   ├── Card.js
│   ├── Header.js
│   ├── Sidebar.js
│   ├── SegmentSelector.js
│   └── ...
├── pages/              # Main application screens
│   ├── Dashboard/
│   ├── UserManagement/
│   ├── DeviceManagement/
│   ├── Reports/
│   ├── KnowledgeCenter/
│   └── ...
├── config/             # Configuration files
│   ├── chartConfig.js
│   ├── routeConfig.js
│   ├── reportDefinitions.js
│   └── ...
├── constants/          # Application-wide constants
│   ├── knowledgeArticles.js
│   ├── enhancedSampleReports.js
│   └── ...
├── context/            # React Context providers
│   ├── AuthContext.js
│   ├── SegmentContext.js
│   └── ...
├── hooks/              # Custom React hooks
│   ├── usePermissions.js
│   ├── useSiteConfig.js
│   ├── useFilters.js
│   └── ...
├── utils/              # Utility functions
│   ├── notifications.js
│   ├── exportUtils.js
│   ├── accessLevels.js
│   └── ...
├── assets/             # Static assets
│   ├── images/
│   └── ...
└── styles/             # Global styles
    ├── toastify-overrides.css
    └── ...
```

## Getting Started

### Prerequisites
- Node.js 14+ and npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view in browser

### Available Scripts

#### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000).
- Page reloads on file changes
- Lint errors shown in console

#### `npm test`
Launches the test runner in interactive watch mode.

#### `npm run build`
Builds the app for production to the `build` folder.
- Optimized and minified build
- Filenames include hashes
- Ready for deployment

See [Create React App deployment documentation](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Development Guidelines

### Adding Segment-Specific Content

When adding new features that need segment-specific behavior:

1. **Import segment context:**
   ```javascript
   import { useSegment } from '../context/SegmentContext';
   import { SEGMENTS } from '../constants/segments';
   ```

2. **Create segment-specific data structures:**
   ```javascript
   const segmentData = useMemo(() => ({
     [SEGMENTS.ENTERPRISE]: [...],
     [SEGMENTS.CO_LIVING]: [...],
     [SEGMENTS.HOTEL]: [...],
     [SEGMENTS.CO_WORKING]: [...],
     [SEGMENTS.PG]: [...],
     [SEGMENTS.MISCELLANEOUS]: [...]
   }), []);
   ```

3. **Filter based on current segment:**
   ```javascript
   const { currentSegment } = useSegment();
   const data = useMemo(() =>
     segmentData[currentSegment] || segmentData[SEGMENTS.MISCELLANEOUS],
     [currentSegment, segmentData]
   );
   ```

### Adding Knowledge Center Videos

To add new video tutorials:

1. Create or record your video content
2. Export in MP4 format (H.264/AAC codec)
3. Name according to the uniform topics:
   - `getting-started.mp4`
   - `user-management.mp4`
   - `device-registration.mp4`
   - `policy-setup.mp4`
   - `reports.mp4`
   - `troubleshooting.mp4`
4. Place in the appropriate segment folder: `public/assets/videos/{segment}/`
5. Videos automatically appear in Knowledge Center for that segment

**Important:** Maintain the uniform naming convention across all segments for consistency.

### Coding Standards

- Use arrow functions and functional components
- Implement prop-types for type checking
- Centralize constants and configurations
- Use CSS variables for theming
- Follow responsive design patterns
- Implement lazy loading for routes
- Use custom hooks for reusable logic
- Keep components modular and composable

### Toast Notifications

The app uses react-toastify with custom styling:
- Success notifications auto-dismiss after 2.5 seconds
- Error notifications auto-dismiss after 4 seconds
- Warning/info notifications auto-dismiss after 3-3.5 seconds
- Loading spinners rotate, but text remains static
- Custom CSS prevents icon rotation except for loading states

## Role-Based Access Control

The platform implements fine-grained RBAC with the following roles:

- **Admin**: Full system access and configuration
- **Manager**: User and device management, reporting
- **Network Admin**: Network configuration, policy setup
- **Viewer**: Read-only access to reports and analytics

Configure permissions using the `usePermissions` hook.

## Segment-Specific Constraints

Each segment has specific constraints and limits:

- **Device Limits**: Maximum devices per user/guest/tenant
- **Policy Types**: Available policy configurations per segment
- **License Types**: Supported license tiers
- **Registration Workflows**: Automatic vs manual device approval

See `src/config/` for detailed segment configurations.

## Documentation

- **SEGMENT_SPECIFIC_KNOWLEDGE_CENTER.md** - Complete knowledge center implementation guide
- **KNOWLEDGE_CENTER_SCREENSHOTS.md** - Screenshot placeholder documentation
- **DEVICE_MODAL_SIZING_FIX.md** - Modal consistency fixes
- **AUTO_DISMISS_FIX.md** - Toast notification auto-dismiss fixes
- **public/assets/videos/README.md** - Video tutorial guide
- **CLAUDE.md** - Project overview for AI assistance

## Known Issues & TODOs

- [ ] Backend integration for real-time MAC validation
- [ ] Replace video placeholders with actual segment-specific recordings
- [ ] Add real screenshots to replace placeholders in articles
- [ ] Optimize large report exports with pagination/streaming
- [ ] Edge case handling for device registration in constrained segments
- [ ] Consider full TypeScript migration

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Build & Deployment

The production build is optimized and ready for deployment:

```bash
npm run build
```

Serve the build folder with any static file server:

```bash
npm install -g serve
serve -s build
```

For advanced deployment options, see [Create React App deployment guide](https://facebook.github.io/create-react-app/docs/deployment).

## License

[Specify your license here]

## Support

For questions or issues:
1. Check documentation in project root (*.md files)
2. Review inline comments in relevant components
3. Check segment configurations in `src/config/`
4. Refer to `CLAUDE.md` for project context

---

**Note:** This platform provides a complete, segment-aware WiFi management solution with tailored experiences for Enterprise, Co-Living, Hotel, Coworking, PG, and Miscellaneous segments. All Knowledge Center content (articles, videos, FAQs) automatically adapts based on the user's current segment selection.
