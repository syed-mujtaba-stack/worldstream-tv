import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Channel } from '@/lib/iptv';

interface RecentlyWatchedChannel {
  id: string;
  channel_id: string;
  channel_name: string;
  channel_logo: string | null;
  channel_url: string;
  channel_country: string | null;
  channel_category: string | null;
  watched_at: string;
}

export function useRecentlyWatched() {
  const { user } = useAuth();
  const [recentChannels, setRecentChannels] = useState<RecentlyWatchedChannel[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecentlyWatched = useCallback(async () => {
    if (!user) {
      setRecentChannels([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('recently_watched')
        .select('*')
        .eq('user_id', user.id)
        .order('watched_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setRecentChannels(data || []);
    } catch (err) {
      console.error('Error fetching recently watched:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchRecentlyWatched();
  }, [fetchRecentlyWatched]);

  const addToRecentlyWatched = async (channel: Channel) => {
    if (!user) return;

    try {
      // Upsert - update watched_at if exists, insert if not
      const { error } = await supabase
        .from('recently_watched')
        .upsert(
          {
            user_id: user.id,
            channel_id: channel.id,
            channel_name: channel.name,
            channel_logo: channel.logo || null,
            channel_url: channel.url,
            channel_country: channel.country || null,
            channel_category: channel.category || null,
            watched_at: new Date().toISOString(),
          },
          { 
            onConflict: 'user_id,channel_id',
            ignoreDuplicates: false 
          }
        );

      if (error) throw error;
      
      // Refresh the list
      await fetchRecentlyWatched();
    } catch (err) {
      console.error('Error adding to recently watched:', err);
    }
  };

  const clearRecentlyWatched = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('recently_watched')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
      setRecentChannels([]);
    } catch (err) {
      console.error('Error clearing recently watched:', err);
    }
  };

  return {
    recentChannels,
    loading,
    addToRecentlyWatched,
    clearRecentlyWatched,
    refetch: fetchRecentlyWatched,
  };
}
