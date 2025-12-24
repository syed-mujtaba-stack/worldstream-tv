import { useState, useMemo } from 'react';
import { useChannels } from '@/hooks/useChannels';
import { ChannelCard } from '@/components/ChannelCard';
import { VideoPlayer } from '@/components/VideoPlayer';
import { CategoryFilter } from '@/components/CategoryFilter';
import { Channel } from '@/lib/iptv';
import { Search as SearchIcon, X, Filter, Globe, LayoutGrid } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export default function Search() {
  const { channels, countries, categories } = useChannels();
  const [query, setQuery] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const results = useMemo(() => {
    let filtered = channels;

    // Apply text search
    if (query.trim()) {
      const q = query.toLowerCase();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(q) || 
        c.country.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(c => c.category.includes(selectedCategory));
    }

    // Apply country filter
    if (selectedCountry !== 'all') {
      filtered = filtered.filter(c => c.country.includes(selectedCountry));
    }

    return filtered.slice(0, 100);
  }, [channels, query, selectedCategory, selectedCountry]);

  const hasActiveFilters = selectedCategory !== 'all' || selectedCountry !== 'all';

  return (
    <div className="min-h-screen pt-14 pb-20 md:pb-8">
      <div className="container px-4 py-6">
        {/* Search Header */}
        <div className="max-w-2xl mx-auto mb-6">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search channels, countries, or categories..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-12 pr-20 h-14 bg-secondary border-border text-lg rounded-2xl"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {query && (
                <button 
                  onClick={() => setQuery('')} 
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              )}
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  'p-2 rounded-full transition-colors',
                  showFilters || hasActiveFilters 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-muted text-muted-foreground'
                )}
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Active filters indicator */}
          {hasActiveFilters && !showFilters && (
            <div className="flex items-center gap-2 mt-3">
              <span className="text-sm text-muted-foreground">Filters:</span>
              {selectedCategory !== 'all' && (
                <span className="px-2 py-1 text-xs rounded-full bg-primary/20 text-primary">
                  {selectedCategory}
                </span>
              )}
              {selectedCountry !== 'all' && (
                <span className="px-2 py-1 text-xs rounded-full bg-primary/20 text-primary">
                  {selectedCountry}
                </span>
              )}
              <button 
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedCountry('all');
                }}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-secondary/50 rounded-2xl border border-border/50 animate-fade-in">
            {/* Category Filter */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                <LayoutGrid className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Category</span>
              </div>
              <CategoryFilter 
                categories={categories} 
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </div>

            {/* Country Filter */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Country</span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <button
                  onClick={() => setSelectedCountry('all')}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all',
                    selectedCountry === 'all'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  )}
                >
                  All
                </button>
                {countries.slice(0, 15).map(country => (
                  <button
                    key={country}
                    onClick={() => setSelectedCountry(country)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all',
                      selectedCountry === country
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    )}
                  >
                    {country}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results count */}
        {(query || hasActiveFilters) && (
          <div className="text-center mb-6">
            <p className="text-sm text-muted-foreground">
              {results.length} channels found
              {results.length === 100 && ' (showing first 100)'}
            </p>
          </div>
        )}

        {/* Results */}
        {query || hasActiveFilters ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {results.map((channel, index) => (
              <div 
                key={channel.id} 
                className="animate-fade-in"
                style={{ animationDelay: `${index * 20}ms` }}
              >
                <ChannelCard 
                  channel={channel} 
                  onClick={() => setSelectedChannel(channel)} 
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <SearchIcon className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">
              Start typing or use filters to find channels
            </p>
          </div>
        )}

        {(query || hasActiveFilters) && results.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No channels found</p>
          </div>
        )}
      </div>

      {selectedChannel && (
        <VideoPlayer 
          channel={selectedChannel} 
          onClose={() => setSelectedChannel(null)} 
        />
      )}
    </div>
  );
}
