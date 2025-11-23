# Segment-Specific Video Tutorial Files

This folder contains segment-specific video files for the Knowledge Center video tutorials. Videos are organized by business segment to provide tailored content for different use cases.

**Location:** `public/assets/videos/{segment}/`

## Folder Structure

```
public/assets/videos/
├── enterprise/          # Enterprise/Corporate WiFi management
├── coLiving/           # Co-Living spaces (residential communities)
├── hotel/              # Hotels and hospitality
├── coWorking/          # Coworking spaces
├── pg/                 # PG (Paying Guest) accommodations
└── miscellaneous/      # General/default content
```

## Adding Segment-Specific Videos

Place your video tutorial files in the appropriate segment folder with the following naming convention:

### Required Video Files (per segment):

1. `getting-started.mp4` - Getting Started guide for the segment
2. `user-management.mp4` - User/Member/Guest management for the segment
3. `device-registration.mp4` - Device registration process
4. `policy-setup.mp4` - Policy/Plan configuration
5. `reports.mp4` - Reports and Analytics
6. `troubleshooting.mp4` - Troubleshooting guide

### Segment-Specific Context:

#### Enterprise (`enterprise/`)
- Corporate user management
- Department-based policies
- Active Directory integration
- Compliance reporting
- BYOD policies

#### Co-Living (`coLiving/`)
- Resident onboarding
- Move-in/move-out processes
- Tiered internet plans
- Occupancy analytics
- Fair usage policies

#### Hotel (`hotel/`)
- Guest WiFi access
- PMS integration
- Voucher-based access
- Automatic check-out expiry
- Premium tier upselling

#### Coworking (`coWorking/`)
- Member management
- Day pass generation
- Flexible membership plans
- Space utilization analytics
- Professional WiFi standards

#### PG (`pg/`)
- Tenant registration
- Room-based access
- Cost-effective plans
- Device limits per tenant
- Rent-linked access control

#### Miscellaneous (`miscellaneous/`)
- General WiFi management
- Standard user management
- Basic device registration
- Default troubleshooting

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
- If a segment-specific video is not found, the system will show an error with helpful instructions

## Adding New Videos

1. Record or source your video content
2. Edit and export in MP4 format (H.264/AAC codec)
3. Name the file according to the convention above
4. Place in the appropriate segment folder
5. Videos will automatically be available in the Knowledge Center for that segment
