import { Channel } from '@/lib/iptv';
import { Heart, Play, Tv } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFavorites } from '@/hooks/useFavorites';
import { useState } from 'react';

interface ChannelCardProps {
  channel: Channel;
  onClick: () => void;
}

export function ChannelCard({ channel, onClick }: ChannelCardProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const [imageError, setImageError] = useState(false);
  const favorite = isFavorite(channel.id);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (favorite) {
      await removeFavorite(channel.id);
    } else {
      await addFavorite(channel);
    }
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative card-elevated overflow-hidden cursor-pointer',
        'transition-all duration-300 hover:scale-[1.02] hover:shadow-glow',
        'border border-border/50 hover:border-primary/50'
      )}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-muted flex items-center justify-center overflow-hidden">
        {channel.logo && !imageError ? (
          <img
            src={channel.logo}
            alt={channel.name}
            className="w-full h-full object-contain p-4"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-secondary to-muted">
            <Tv className="w-12 h-12 text-muted-foreground" />
          </div>
        )}
        
        {/* Play overlay */}
        <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-glow animate-pulse-glow">
            <Play className="w-6 h-6 text-primary-foreground ml-1" />
          </div>
        </div>

        {/* Country badge */}
        {channel.country && channel.country !== 'Unknown' && (
          <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-medium rounded-full bg-background/80 backdrop-blur-sm text-foreground">
            {channel.country.split(';')[0]}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm truncate">{channel.name}</h3>
            {channel.category && (
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {channel.category}
              </p>
            )}
          </div>
          <button
            onClick={handleFavoriteClick}
            className={cn(
              'p-1.5 rounded-full transition-colors',
              favorite 
                ? 'text-red-500 bg-red-500/10' 
                : 'text-muted-foreground hover:text-red-500 hover:bg-red-500/10'
            )}
          >
            <Heart className={cn('w-4 h-4', favorite && 'fill-current')} />
          </button>
        </div>
      </div>
    </div>
  );
}
