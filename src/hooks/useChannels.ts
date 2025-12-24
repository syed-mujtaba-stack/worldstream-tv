import { useState, useEffect } from 'react';
import { Channel, fetchChannels, getUniqueCountries, getUniqueCategories } from '@/lib/iptv';

export function useChannels() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countries, setCountries] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    loadChannels();
  }, []);

  const loadChannels = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchChannels();
      setChannels(data);
      setCountries(getUniqueCountries(data));
      setCategories(getUniqueCategories(data));
    } catch (err) {
      setError('Failed to load channels');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    channels,
    loading,
    error,
    countries,
    categories,
    refetch: loadChannels,
  };
}
