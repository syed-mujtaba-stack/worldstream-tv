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

const PLAYLIST_URL = 'https://iptv-org.github.io/iptv/index.m3u';

export async function fetchChannels(): Promise<Channel[]> {
  try {
    const response = await fetch(PLAYLIST_URL);
    const text = await response.text();
    return parseM3U(text);
  } catch (error) {
    console.error('Error fetching channels:', error);
    return [];
  }
}

function parseM3U(content: string): Channel[] {
  const lines = content.split('\n');
  const channels: Channel[] = [];
  
  let currentChannel: Partial<ParsedChannel> = {};
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.startsWith('#EXTINF:')) {
      const info = parseExtInf(line);
      currentChannel = {
        ...info,
        id: `channel-${channels.length}`,
      };
    } else if (line && !line.startsWith('#') && currentChannel.id) {
      channels.push({
        id: currentChannel.id,
        name: currentChannel.name || 'Unknown',
        logo: currentChannel.logo || '',
        url: line,
        country: currentChannel.tvgCountry || 'Unknown',
        category: currentChannel.group || 'General',
        languages: currentChannel.tvgLanguage ? [currentChannel.tvgLanguage] : [],
      });
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
  channels.forEach(channel => {
    if (channel.country && channel.country !== 'Unknown') {
      // Handle multiple countries separated by semicolon
      channel.country.split(';').forEach(c => {
        if (c.trim()) countries.add(c.trim());
      });
    }
  });
  return Array.from(countries).sort();
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
