// src/hooks/useVideoDurations.js

import { useState, useEffect } from 'react';

/**
 * Custom hook to load actual video durations from video files
 * @param {Array} videos - Array of video objects with videoFile property
 * @returns {Object} - Map of videoFile to duration string (MM:SS format)
 */
export const useVideoDurations = (videos) => {
  const [durations, setDurations] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!videos || videos.length === 0) {
      setLoading(false);
      return;
    }

    const loadDurations = async () => {
      const durationsMap = {};

      // Load durations for each video
      const promises = videos.map((video) => {
        return new Promise((resolve) => {
          const videoElement = document.createElement('video');
          videoElement.preload = 'metadata';

          videoElement.onloadedmetadata = () => {
            const durationSeconds = videoElement.duration;
            const minutes = Math.floor(durationSeconds / 60);
            const seconds = Math.floor(durationSeconds % 60);
            const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;

            durationsMap[video.videoFile] = formattedDuration;
            videoElement.src = ''; // Clear source to free memory
            resolve();
          };

          videoElement.onerror = () => {
            // Fallback to the provided duration if loading fails
            durationsMap[video.videoFile] = video.duration || '0:00';
            videoElement.src = ''; // Clear source to free memory
            resolve();
          };

          // Set video source
          videoElement.src = `/assets/videos/${video.videoFile}`;
        });
      });

      await Promise.all(promises);
      setDurations(durationsMap);
      setLoading(false);
    };

    loadDurations();
  }, [videos]);

  return { durations, loading };
};

export default useVideoDurations;
