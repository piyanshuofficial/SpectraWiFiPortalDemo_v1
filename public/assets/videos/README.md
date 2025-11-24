# Segment-Specific Video Tutorial Files

This folder contains segment-specific video files for the Knowledge Center video tutorials. Videos are organized by business segment to provide tailored content for different use cases.

**Location:** `public/assets/videos/{segment}/`

---

## 🎯 KEY PRINCIPLE: Uniform Topics, Tailored Content

**All 6 business segments follow the exact same structure:**
- ✅ **Same 6 video topics** across all segments
- ✅ **Identical naming convention** (getting-started.mp4, user-management.mp4, etc.)
- ✅ **Consistent topic order** (1-6, as listed below)
- ✅ **Predictable file structure** in each segment folder

**What varies:** The actual video content is customized for each segment's terminology, workflows, and use cases.

---

## Uniform Video Topics

**IMPORTANT:** All segments follow a **uniform and consistent structure** with the same 6 core video topics. This ensures a predictable, familiar learning experience regardless of which segment users are in.

### The 6 Standardized Topics (same for all segments):

1. **Getting Started** - `getting-started.mp4`
2. **User Management** - `user-management.mp4`
3. **Device Registration** - `device-registration.mp4`
4. **Policy Setup** - `policy-setup.mp4`
5. **Reports & Analytics** - `reports.mp4`
6. **Troubleshooting** - `troubleshooting.mp4`

**What's uniform:** The topic structure, naming convention, and number of videos (6 per segment)
**What's different:** The actual video content is tailored to each segment's specific needs and terminology

## Folder Structure

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
│   ├── getting-started.mp4
│   ├── user-management.mp4
│   ├── device-registration.mp4
│   ├── policy-setup.mp4
│   ├── reports.mp4
│   └── troubleshooting.mp4
├── hotel/
│   ├── getting-started.mp4
│   ├── user-management.mp4
│   ├── device-registration.mp4
│   ├── policy-setup.mp4
│   ├── reports.mp4
│   └── troubleshooting.mp4
├── coWorking/
│   ├── getting-started.mp4
│   ├── user-management.mp4
│   ├── device-registration.mp4
│   ├── policy-setup.mp4
│   ├── reports.mp4
│   └── troubleshooting.mp4
├── pg/
│   ├── getting-started.mp4
│   ├── user-management.mp4
│   ├── device-registration.mp4
│   ├── policy-setup.mp4
│   ├── reports.mp4
│   └── troubleshooting.mp4
└── miscellaneous/
    ├── getting-started.mp4
    ├── user-management.mp4
    ├── device-registration.mp4
    ├── policy-setup.mp4
    ├── reports.mp4
    └── troubleshooting.mp4
```

## Required Video Files (per segment)

Each segment folder **MUST** contain these exact 6 video files:

| # | Video File | Topic | Description |
|---|------------|-------|-------------|
| 1 | `getting-started.mp4` | Getting Started | Segment-specific onboarding and initial setup |
| 2 | `user-management.mp4` | User Management | Managing users/members/guests/residents/tenants |
| 3 | `device-registration.mp4` | Device Registration | Device registration and management process |
| 4 | `policy-setup.mp4` | Policy Setup | Configuring policies, plans, and network settings |
| 5 | `reports.mp4` | Reports & Analytics | Generating reports and viewing analytics |
| 6 | `troubleshooting.mp4` | Troubleshooting | Common issues and troubleshooting steps |

**Naming Convention:**
- Use lowercase with hyphens (kebab-case)
- File extension: `.mp4` (recommended)
- Exact names as listed above - do NOT modify
- All 6 files must be present in each segment folder

### Benefits of Uniform Structure

✅ **Predictable Learning**: Users know exactly what topics to expect
✅ **Easy Navigation**: Consistent topic order across all segments
✅ **Simplified Maintenance**: Same structure to update across segments
✅ **Reduced Confusion**: No missing or differently-named topics
✅ **Scalable**: Easy to add new segments following the same pattern

### Segment-Specific Content (same structure, different content)

While the **structure and naming are uniform**, the actual **video content is tailored** to each segment's unique needs:

#### Enterprise (`enterprise/`)
Focus: Corporate environment, compliance, departmental management
- Corporate user management with Active Directory integration
- Department-based policy configuration
- Compliance reporting and audit trails
- BYOD (Bring Your Own Device) policies
- Enterprise-grade security and access control

#### Co-Living (`coLiving/`)
Focus: Residential communities, tenant lifecycle, fair usage
- Resident onboarding and move-in/move-out processes
- Tiered internet plans for different resident types
- Occupancy tracking and analytics
- Fair usage policies for shared bandwidth
- Community-specific device management

#### Hotel (`hotel/`)
Focus: Guest experience, temporary access, PMS integration
- Guest WiFi access methods (vouchers, QR codes, room numbers)
- PMS (Property Management System) integration
- Automatic check-out and access expiry
- Premium tier upselling strategies
- Conference and event WiFi management

#### Coworking (`coWorking/`)
Focus: Flexible memberships, professional environment, space utilization
- Member management (hot desk, dedicated desk, private office)
- Day pass and temporary access generation
- Flexible membership plans and bandwidth tiers
- Space utilization analytics and capacity planning
- Professional WiFi standards for video conferencing

#### PG (`pg/`)
Focus: Tenant management, cost efficiency, room-based access
- Tenant registration and room-based access control
- Cost-effective internet plans for paying guests
- Device limits per tenant/room
- Rent-linked WiFi access suspension
- Fair bandwidth distribution across tenants

#### Miscellaneous (`miscellaneous/`)
Focus: General-purpose WiFi management
- Standard WiFi management operations
- General user and device management
- Basic policy setup and configuration
- Standard troubleshooting procedures
- Default reporting and analytics

### Uniform Topics Matrix

| Topic # | Video File | Enterprise | Co-Living | Hotel | Coworking | PG | Miscellaneous |
|---------|------------|------------|-----------|-------|-----------|----|--------------|
| 1 | `getting-started.mp4` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 2 | `user-management.mp4` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 3 | `device-registration.mp4` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 4 | `policy-setup.mp4` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 5 | `reports.mp4` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 6 | `troubleshooting.mp4` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

**All segments have identical structure with 6 videos each.**

## Supported Formats

The custom video player supports the following formats:
- **MP4** (H.264/AAC) - Recommended for best compatibility
- **WebM** (VP8/VP9/Vorbis)
- **OGG** (Theora/Vorbis)

## Recommendations

- **Resolution**: 1280x720 (720p) or 1920x1080 (1080p)
- **Aspect Ratio**: 16:9
- **Bitrate**: 2-5 Mbps for 720p, 5-8 Mbps for 1080p
- **File Size**: Keep under 50MB for faster loading
- **Duration**: 5-15 minutes for optimal user engagement

## Creating Sample Videos

For testing purposes, you can:
1. Create a short screen recording using OBS Studio, QuickTime, or Windows Game Bar
2. Use free stock video sites like Pexels Videos or Pixabay
3. Generate placeholder videos using tools like FFmpeg

### Example: Create a 10-second test video with FFmpeg
```bash
ffmpeg -f lavfi -i testsrc=duration=10:size=1280x720:rate=30 -pix_fmt yuv420p enterprise/getting-started.mp4
```

## Current Status

✅ **Sample video present in all segment folders**

A sample `getting-started.mp4` video has been copied to each segment folder for testing. Replace these with segment-specific content as needed.

## How It Works

The Knowledge Center automatically displays content based on the user's current segment:
- When a user switches segments, articles, videos, and FAQs automatically update
- Video paths are constructed as: `/assets/videos/{currentSegment}/{videoFile}.mp4`
- **All segments display the same 6 video topics** in the same order
- Only the video content itself differs based on segment context
- If a segment-specific video is not found, the system will show an error with helpful instructions

## Adding New Videos

### For a Single Segment:

1. Record or source your video content tailored to that segment
2. Edit and export in MP4 format (H.264/AAC codec)
3. **Use exact filename from the 6 standardized topics** (e.g., `getting-started.mp4`)
4. Place in the appropriate segment folder (e.g., `hotel/getting-started.mp4`)
5. Video will automatically be available in the Knowledge Center for that segment

### For All Segments (Recommended Workflow):

When creating videos for a new topic or updating existing ones:

1. **Plan content** for all 6 segments to maintain consistency
2. **Record segment-specific versions** of the same topic
3. **Use identical filenames** across all segments (uniform naming)
4. **Distribute videos** to their respective segment folders:
   ```
   enterprise/getting-started.mp4
   coLiving/getting-started.mp4
   hotel/getting-started.mp4
   coWorking/getting-started.mp4
   pg/getting-started.mp4
   miscellaneous/getting-started.mp4
   ```
5. **Verify uniformity**: All segments should have the same 6 video files

### Video Content Guidelines:

When creating segment-specific content, ensure:
- **Topic coverage** remains consistent (e.g., all "Getting Started" videos cover initial setup)
- **Terminology** matches the segment (guests/residents/tenants/members/users)
- **Workflows** reflect segment-specific processes
- **Examples** use segment-appropriate scenarios
- **Duration** is similar across segments (±2 minutes variance is acceptable)
