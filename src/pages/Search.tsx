import { useState, useMemo } from 'react';
import { useChannels } from '@/hooks/useChannels';
import { ChannelCard } from '@/components/ChannelCard';
import { VideoPlayer } from '@/components/VideoPlayer';
import { Channel } from '@/lib/iptv';
import { Search as SearchIcon, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function Search() {
  const { channels, countries } = useChannels();
  const [query, setQuery] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return channels
      .filter(c => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q))
      .slice(0, 50);
  }, [channels, query]);

  return (
    <div className="min-h-screen pt-14 pb-20 md:pb-8">
      <div className="container px-4 py-6">
        <div className="relative max-w-xl mx-auto mb-8">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search channels or countries..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-12 pr-10 h-12 bg-secondary border-border text-lg"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          )}
        </div>

        {query ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {results.map(channel => (
              <ChannelCard key={channel.id} channel={channel} onClick={() => setSelectedChannel(channel)} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">Start typing to search channels</p>
        )}
      </div>

      {selectedChannel && <VideoPlayer channel={selectedChannel} onClose={() => setSelectedChannel(null)} />}
    </div>
  );
}
