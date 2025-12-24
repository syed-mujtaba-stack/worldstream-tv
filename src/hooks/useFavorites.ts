import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Channel } from '@/lib/iptv';
import { toast } from 'sonner';

interface Favorite {
  id: string;
  channel_id: string;
  channel_name: string;
  channel_logo: string | null;
  channel_url: string;
  channel_country: string | null;
}

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setFavorites([]);
      setLoading(false);
    }
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setFavorites(data || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = async (channel: Channel) => {
    if (!user) {
      toast.error('Please sign in to add favorites');
      return false;
    }

    try {
      const { error } = await supabase.from('favorites').insert({
        user_id: user.id,
        channel_id: channel.id,
        channel_name: channel.name,
        channel_logo: channel.logo,
        channel_url: channel.url,
        channel_country: channel.country,
      });

      if (error) throw error;

      await fetchFavorites();
      toast.success('Added to favorites');
      return true;
    } catch (error: any) {
      if (error.code === '23505') {
        toast.error('Already in favorites');
      } else {
        toast.error('Failed to add favorite');
      }
      return false;
    }
  };

  const removeFavorite = async (channelId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('channel_id', channelId);

      if (error) throw error;

      await fetchFavorites();
      toast.success('Removed from favorites');
      return true;
    } catch (error) {
      toast.error('Failed to remove favorite');
      return false;
    }
  };

  const isFavorite = (channelId: string) => {
    return favorites.some(f => f.channel_id === channelId);
  };

  return {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    isFavorite,
    refetch: fetchFavorites,
  };
}
