import { useState, useMemo } from 'react';
import { useChannels } from '@/hooks/useChannels';
import { ChannelCard } from '@/components/ChannelCard';
import { VideoPlayer } from '@/components/VideoPlayer';
import { LoadingScreen } from '@/components/LoadingScreen';
import { RecentlyWatched } from '@/components/RecentlyWatched';
import { TVGuide } from '@/components/TVGuide';
import { CategoryFilter } from '@/components/CategoryFilter';
import { Channel } from '@/lib/iptv';
import { Globe, Radio, TrendingUp, Tv2, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Index() {
  const { channels, loading, countries, categories } = useChannels();
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const featuredChannels = useMemo(() => {
    return channels.slice(0, 6);
  }, [channels]);

  const filteredChannels = useMemo(() => {
    let result = channels;
    
    if (selectedCountry !== 'all') {
      result = result.filter(c => c.country.includes(selectedCountry));
    }
    
    if (selectedCategory !== 'all') {
      result = result.filter(c => c.category.includes(selectedCategory));
    }
    
    return result.slice(0, 50);
  }, [channels, selectedCountry, selectedCategory]);

  const popularCountries = useMemo(() => {
    return countries.slice(0, 10);
  }, [countries]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen pt-14 pb-20 md:pb-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />
        
        <div className="container relative px-4 py-12 md:py-20">
          <div className="max-w-2xl mx-auto text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Radio className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">Live Now</span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">
              <span className="text-gradient">World TV</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Stream thousands of live TV channels from around the globe
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-10">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-2xl font-bold text-primary">
                <Globe className="w-5 h-5" />
                {countries.length}+
              </div>
              <p className="text-sm text-muted-foreground">Countries</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-2xl font-bold text-primary">
                <Tv2 className="w-5 h-5" />
                {channels.length}+
              </div>
              <p className="text-sm text-muted-foreground">Channels</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-2xl font-bold text-primary">
                <LayoutGrid className="w-5 h-5" />
                {categories.length}+
              </div>
              <p className="text-sm text-muted-foreground">Categories</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recently Watched */}
      <RecentlyWatched onChannelClick={setSelectedChannel} />

      {/* TV Guide */}
      <TVGuide channels={channels} onChannelClick={setSelectedChannel} />

      {/* Featured Channels */}
      <section className="container px-4 mb-10">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h2 className="font-display text-xl font-semibold">Featured</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {featuredChannels.map((channel, index) => (
            <div key={channel.id} className="animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
              <ChannelCard
                channel={channel}
                onClick={() => setSelectedChannel(channel)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Category Filter */}
      <section className="container px-4 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <LayoutGrid className="w-5 h-5 text-primary" />
          <h2 className="font-display text-xl font-semibold">Browse by Category</h2>
        </div>
        <CategoryFilter 
          categories={categories} 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </section>

      {/* Country Filter */}
      <section className="container px-4 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="w-5 h-5 text-primary" />
          <h2 className="font-display text-xl font-semibold">Browse by Country</h2>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setSelectedCountry('all')}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
              selectedCountry === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            )}
          >
            All Countries
          </button>
          {popularCountries.map(country => (
            <button
              key={country}
              onClick={() => setSelectedCountry(country)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
                selectedCountry === country
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              )}
            >
              {country}
            </button>
          ))}
        </div>
      </section>

      {/* Channel Grid */}
      <section className="container px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredChannels.map((channel, index) => (
            <div key={channel.id} className="animate-fade-in" style={{ animationDelay: `${index * 20}ms` }}>
              <ChannelCard
                channel={channel}
                onClick={() => setSelectedChannel(channel)}
              />
            </div>
          ))}
        </div>

        {filteredChannels.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No channels found for this selection</p>
          </div>
        )}
      </section>

      {/* Video Player Modal */}
      {selectedChannel && (
        <VideoPlayer
          channel={selectedChannel}
          onClose={() => setSelectedChannel(null)}
        />
      )}
    </div>
  );
}
