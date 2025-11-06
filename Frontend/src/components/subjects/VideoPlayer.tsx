import { useState } from 'react';
import { PlayCircleIcon } from '@heroicons/react/24/solid';

interface VideoPlayerProps {
  url: string;
  platform: 'YOUTUBE' | 'VIMEO' | 'DAILYMOTION';
  title: string;
}

// Extract video ID from URL
const getVideoId = (url: string, platform: string): string | null => {
  try {
    const urlObj = new URL(url);
    
    if (platform === 'YOUTUBE') {
      // Handle different YouTube URL formats
      if (urlObj.hostname.includes('youtu.be')) {
        return urlObj.pathname.slice(1);
      }
      return urlObj.searchParams.get('v');
    }
    
    if (platform === 'VIMEO') {
      // Vimeo URLs: https://vimeo.com/123456789
      const match = url.match(/vimeo\.com\/(\d+)/);
      return match ? match[1] : null;
    }
    
    if (platform === 'DAILYMOTION') {
      // Dailymotion URLs: https://www.dailymotion.com/video/x123abc
      const match = url.match(/dailymotion\.com\/video\/([^_]+)/);
      return match ? match[1] : null;
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing video URL:', error);
    return null;
  }
};

// Get embed URL based on platform
const getEmbedUrl = (videoId: string, platform: string): string => {
  switch (platform) {
    case 'YOUTUBE':
      return `https://www.youtube.com/embed/${videoId}?rel=0`;
    case 'VIMEO':
      return `https://player.vimeo.com/video/${videoId}`;
    case 'DAILYMOTION':
      return `https://www.dailymotion.com/embed/video/${videoId}`;
    default:
      return '';
  }
};

export default function VideoPlayer({ url, platform, title }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoId = getVideoId(url, platform);

  if (!videoId) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800 text-sm">
          Unable to load video. Please check the URL format.
        </p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-red-600 hover:text-red-700 text-sm underline mt-2 inline-block"
        >
          Open video in new tab
        </a>
      </div>
    );
  }

  const embedUrl = getEmbedUrl(videoId, platform);

  return (
    <div className="relative w-full rounded-lg overflow-hidden bg-black shadow-lg">
      {/* 16:9 Aspect Ratio Container */}
      <div className="relative pb-[56.25%]">
        {!isPlaying ? (
          // Thumbnail with play button
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
            <button
              onClick={() => setIsPlaying(true)}
              className="group relative"
            >
              {/* Play button */}
              <div className="relative">
                <PlayCircleIcon className="h-20 w-20 text-white opacity-90 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 bg-cms-primary rounded-full blur-xl opacity-50 group-hover:opacity-70 transition-opacity" />
              </div>
              
              {/* Video info */}
              <div className="mt-4 text-center">
                <p className="text-white text-sm font-medium">{title}</p>
                <p className="text-white/60 text-xs mt-1 uppercase">{platform}</p>
              </div>
            </button>
          </div>
        ) : (
          // Embedded video player
          <iframe
            className="absolute inset-0 w-full h-full"
            src={embedUrl}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
    </div>
  );
}