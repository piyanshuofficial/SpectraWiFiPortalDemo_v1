# Video Tutorial Files

This folder contains video files for the Knowledge Center video tutorials.

**Location:** `public/assets/videos/`

## Adding Videos

Place your video tutorial files in this folder (`public/assets/videos/`) with the following naming convention:

- `getting-started.mp4` - Getting Started with WiFi Portal
- `user-management.mp4` - Adding and Managing Users
- `device-registration.mp4` - Device Registration Process
- `policy-setup.mp4` - Creating and Managing Policies
- `reports.mp4` - Generating Reports and Analytics
- `troubleshooting.mp4` - Troubleshooting Common Issues

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
ffmpeg -f lavfi -i testsrc=duration=10:size=1280x720:rate=30 -pix_fmt yuv420p getting-started.mp4
```

## Current Status

⚠️ **No video files currently present**

Add your tutorial videos to this folder following the naming convention above. The application will automatically load them for playback in the Knowledge Center.
