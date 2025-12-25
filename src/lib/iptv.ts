export interface Channel {
  id: string;
  name: string;
  logo: string;
  url: string;
  country: string;
  category: string;
  languages: string[];
}

export interface ParsedChannel {
  id: string;
  name: string;
  logo: string;
  url: string;
  group: string;
  tvgId: string;
  tvgCountry: string;
  tvgLanguage: string;
}

// Country-specific playlists for better quality streams
const COUNTRY_PLAYLISTS: Record<string, string> = {
  'PK': 'https://iptv-org.github.io/iptv/countries/pk.m3u',
  'IN': 'https://iptv-org.github.io/iptv/countries/in.m3u',
};

// Category-specific playlists
const CATEGORY_PLAYLISTS: Record<string, string> = {
  'News': 'https://iptv-org.github.io/iptv/categories/news.m3u',
  'Sports': 'https://iptv-org.github.io/iptv/categories/sports.m3u',
  'Entertainment': 'https://iptv-org.github.io/iptv/categories/entertainment.m3u',
  'Movies': 'https://iptv-org.github.io/iptv/categories/movies.m3u',
  'Music': 'https://iptv-org.github.io/iptv/categories/music.m3u',
  'Kids': 'https://iptv-org.github.io/iptv/categories/kids.m3u',
  'Documentary': 'https://iptv-org.github.io/iptv/categories/documentary.m3u',
  'Religious': 'https://iptv-org.github.io/iptv/categories/religious.m3u',
};

// Main playlist as fallback
const MAIN_PLAYLIST_URL = 'https://iptv-org.github.io/iptv/index.m3u';

async function fetchPlaylist(url: string): Promise<Channel[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) return [];
    const text = await response.text();
    return parseM3U(text);
  } catch (error) {
    console.error(`Error fetching playlist ${url}:`, error);
    return [];
  }
}

export async function fetchChannels(): Promise<Channel[]> {
  try {
    // Fetch priority playlists (Pakistan & India) first
    const priorityPromises = Object.entries(COUNTRY_PLAYLISTS).map(
      async ([countryCode, url]) => {
        const channels = await fetchPlaylist(url);
        // Mark these channels with their country code
        return channels.map(ch => ({
          ...ch,
          country: ch.country || countryCode,
        }));
      }
    );

    // Fetch category playlists
    const categoryPromises = Object.entries(CATEGORY_PLAYLISTS).map(
      async ([category, url]) => {
        const channels = await fetchPlaylist(url);
        return channels.map(ch => ({
          ...ch,
          category: ch.category || category,
        }));
      }
    );

    // Fetch main playlist as fallback
    const mainPromise = fetchPlaylist(MAIN_PLAYLIST_URL);

    // Wait for all playlists
    const [priorityResults, categoryResults, mainChannels] = await Promise.all([
      Promise.all(priorityPromises),
      Promise.all(categoryPromises),
      mainPromise,
    ]);

    // Combine all channels, removing duplicates by URL
    const allChannels: Channel[] = [];
    const seenUrls = new Set<string>();

    // Add priority channels first (Pakistan/India)
    for (const channels of priorityResults) {
      for (const channel of channels) {
        if (!seenUrls.has(channel.url)) {
          seenUrls.add(channel.url);
          allChannels.push(channel);
        }
      }
    }

    // Add category channels
    for (const channels of categoryResults) {
      for (const channel of channels) {
        if (!seenUrls.has(channel.url)) {
          seenUrls.add(channel.url);
          allChannels.push(channel);
        }
      }
    }

    // Add main playlist channels
    for (const channel of mainChannels) {
      if (!seenUrls.has(channel.url)) {
        seenUrls.add(channel.url);
        allChannels.push(channel);
      }
    }

    return allChannels;
  } catch (error) {
    console.error('Error fetching channels:', error);
    return [];
  }
}

function parseM3U(content: string): Channel[] {
  const lines = content.split('\n');
  const channels: Channel[] = [];
  
  let currentChannel: Partial<ParsedChannel> = {};
  let channelIndex = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.startsWith('#EXTINF:')) {
      const info = parseExtInf(line);
      currentChannel = {
        ...info,
        id: `channel-${channelIndex++}-${Date.now()}`,
      };
    } else if (line && !line.startsWith('#') && currentChannel.id) {
      // Only include HTTPS streams to avoid mixed content errors
      // Browsers block HTTP content on HTTPS pages
      if (line.startsWith('https://')) {
        channels.push({
          id: currentChannel.id,
          name: currentChannel.name || 'Unknown',
          logo: currentChannel.logo || '',
          url: line,
          country: currentChannel.tvgCountry || 'Unknown',
          category: currentChannel.group || 'General',
          languages: currentChannel.tvgLanguage ? [currentChannel.tvgLanguage] : [],
        });
      }
      currentChannel = {};
    }
  }
  
  return channels;
}

function parseExtInf(line: string): Partial<ParsedChannel> {
  const result: Partial<ParsedChannel> = {};
  
  // Extract tvg-id
  const tvgIdMatch = line.match(/tvg-id="([^"]*)"/);
  if (tvgIdMatch) result.tvgId = tvgIdMatch[1];
  
  // Extract tvg-logo
  const logoMatch = line.match(/tvg-logo="([^"]*)"/);
  if (logoMatch) result.logo = logoMatch[1];
  
  // Extract tvg-country
  const countryMatch = line.match(/tvg-country="([^"]*)"/);
  if (countryMatch) result.tvgCountry = countryMatch[1];
  
  // Extract tvg-language
  const langMatch = line.match(/tvg-language="([^"]*)"/);
  if (langMatch) result.tvgLanguage = langMatch[1];
  
  // Extract group-title
  const groupMatch = line.match(/group-title="([^"]*)"/);
  if (groupMatch) result.group = groupMatch[1];
  
  // Extract channel name (after the last comma)
  const nameMatch = line.match(/,(.+)$/);
  if (nameMatch) result.name = nameMatch[1].trim();
  
  return result;
}

export function getUniqueCountries(channels: Channel[]): string[] {
  const countries = new Set<string>();
  // Prioritize Pakistan and India at the top
  const priorityCountries = ['PK', 'IN'];
  
  channels.forEach(channel => {
    if (channel.country && channel.country !== 'Unknown') {
      // Handle multiple countries separated by semicolon
      channel.country.split(';').forEach(c => {
        if (c.trim()) countries.add(c.trim());
      });
    }
  });
  
  const sortedCountries = Array.from(countries).sort();
  
  // Move priority countries to the top
  const result: string[] = [];
  for (const pc of priorityCountries) {
    if (sortedCountries.includes(pc)) {
      result.push(pc);
    }
  }
  for (const c of sortedCountries) {
    if (!priorityCountries.includes(c)) {
      result.push(c);
    }
  }
  
  return result;
}

export function getUniqueCategories(channels: Channel[]): string[] {
  const categories = new Set<string>();
  channels.forEach(channel => {
    if (channel.category) {
      categories.add(channel.category);
    }
  });
  return Array.from(categories).sort();
}
