import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { X, Volume2, VolumeX, Maximize, Minimize, Play, Pause, AlertCircle } from 'lucide-react';
import { Channel } from '@/lib/iptv';
import { cn } from '@/lib/utils';
import { useRecentlyWatched } from '@/hooks/useRecentlyWatched';

interface VideoPlayerProps {
  channel: Channel;
  onClose: () => void;
}

export function VideoPlayer({ channel, onClose }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  const { addToRecentlyWatched } = useRecentlyWatched();
  const hasTrackedRef = useRef(false);

  // Track channel as recently watched
  useEffect(() => {
    if (!hasTrackedRef.current) {
      hasTrackedRef.current = true;
      addToRecentlyWatched(channel);
    }
  }, [channel, addToRecentlyWatched]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setError(null);
    setIsPlaying(false);

    const url = channel.url;

    if (Hls.isSupported() && url.includes('.m3u8')) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });
      
      hls.loadSource(url);
      hls.attachMedia(video);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {});
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          setError('Unable to play this channel');
        }
      });

      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
      video.play().catch(() => {});
    } else {
      video.src = url;
      video.play().catch(() => {
        setError('This format is not supported');
      });
    }
  }, [channel.url]);

  const handlePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 bg-background flex flex-col"
      onMouseMove={handleMouseMove}
      onClick={handleMouseMove}
    >
      {/* Header */}
      <div 
        className={cn(
          'absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-background to-transparent',
          'transition-opacity duration-300',
          showControls ? 'opacity-100' : 'opacity-0'
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-secondary/80 hover:bg-secondary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div>
              <h2 className="font-display font-semibold text-lg">{channel.name}</h2>
              <p className="text-sm text-muted-foreground">{channel.country}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Video */}
      <div className="flex-1 flex items-center justify-center bg-black">
        {error ? (
          <div className="flex flex-col items-center gap-4 text-center p-8">
            <AlertCircle className="w-16 h-16 text-destructive" />
            <div>
              <h3 className="font-semibold text-lg">{error}</h3>
              <p className="text-muted-foreground mt-1">Try another channel</p>
            </div>
          </div>
        ) : (
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            autoPlay
            playsInline
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onError={() => setError('Failed to load stream')}
          />
        )}
      </div>

      {/* Controls */}
      <div 
        className={cn(
          'absolute bottom-0 left-0 right-0 z-10 p-4 bg-gradient-to-t from-background to-transparent',
          'transition-opacity duration-300 safe-area-bottom',
          showControls ? 'opacity-100' : 'opacity-0'
        )}
      >
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={handlePlay}
            className="p-3 rounded-full bg-primary text-primary-foreground hover:scale-110 transition-transform"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
          </button>
          <button
            onClick={handleMute}
            className="p-3 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <button
            onClick={handleFullscreen}
            className="p-3 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
          >
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
