import { History, X } from 'lucide-react';
import { Channel } from '@/lib/iptv';
import { ChannelCard } from './ChannelCard';
import { useRecentlyWatched } from '@/hooks/useRecentlyWatched';
import { useAuth } from '@/contexts/AuthContext';

interface RecentlyWatchedProps {
  onChannelClick: (channel: Channel) => void;
}

export function RecentlyWatched({ onChannelClick }: RecentlyWatchedProps) {
  const { user } = useAuth();
  const { recentChannels, loading, clearRecentlyWatched } = useRecentlyWatched();

  if (!user || loading || recentChannels.length === 0) {
    return null;
  }

  // Convert to Channel format
  const channels: Channel[] = recentChannels.map(rc => ({
    id: rc.channel_id,
    name: rc.channel_name,
    logo: rc.channel_logo || '',
    url: rc.channel_url,
    country: rc.channel_country || 'Unknown',
    category: rc.channel_category || 'General',
    languages: [],
  }));

  return (
    <section className="container px-4 mb-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <History className="w-5 h-5 text-primary" />
          <h2 className="font-display text-xl font-semibold">Continue Watching</h2>
        </div>
        <button
          onClick={clearRecentlyWatched}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          Clear
        </button>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {channels.map((channel, index) => (
          <div 
            key={channel.id} 
            className="flex-shrink-0 w-[180px] md:w-[200px] animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <ChannelCard
              channel={channel}
              onClick={() => onChannelClick(channel)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
