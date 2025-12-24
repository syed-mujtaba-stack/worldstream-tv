import { useState } from 'react';
import { useFavorites } from '@/hooks/useFavorites';
import { ChannelCard } from '@/components/ChannelCard';
import { VideoPlayer } from '@/components/VideoPlayer';
import { Channel } from '@/lib/iptv';
import { Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export default function Favorites() {
  const { user } = useAuth();
  const { favorites, loading } = useFavorites();
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

  if (!user) return <Navigate to="/auth" replace />;

  const channels: Channel[] = favorites.map(f => ({
    id: f.channel_id,
    name: f.channel_name,
    logo: f.channel_logo || '',
    url: f.channel_url,
    country: f.channel_country || '',
    category: '',
    languages: [],
  }));

  return (
    <div className="min-h-screen pt-14 pb-20 md:pb-8">
      <div className="container px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Heart className="w-6 h-6 text-primary" />
          <h1 className="font-display text-2xl font-bold">My Favorites</h1>
        </div>

        {channels.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {channels.map(channel => (
              <ChannelCard key={channel.id} channel={channel} onClick={() => setSelectedChannel(channel)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">No favorites yet. Start adding channels!</p>
          </div>
        )}
      </div>

      {selectedChannel && <VideoPlayer channel={selectedChannel} onClose={() => setSelectedChannel(null)} />}
    </div>
  );
}
