import { useState } from 'react';
import { Calendar, Clock, ChevronRight, Tv, Radio } from 'lucide-react';
import { Channel } from '@/lib/iptv';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface TVGuideProps {
  channels: Channel[];
  onChannelClick: (channel: Channel) => void;
}

// Generate mock program data since IPTV doesn't provide EPG
function generateMockPrograms(channel: Channel) {
  const now = new Date();
  const programs = [];
  
  const programTitles = [
    'Morning News', 'Talk Show', 'Documentary', 'Sports Live', 'Movie Special',
    'Evening News', 'Drama Series', 'Reality Show', 'Late Night', 'Music Hour',
    'Comedy Show', 'Interview', 'Nature Documentary', 'Game Show', 'Lifestyle'
  ];
  
  // Generate 6 programs for the day
  for (let i = 0; i < 6; i++) {
    const startTime = new Date(now);
    startTime.setHours(startTime.getHours() - 2 + i * 2, 0, 0, 0);
    
    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + 2);
    
    const isLive = now >= startTime && now < endTime;
    const isPast = now >= endTime;
    
    programs.push({
      id: `${channel.id}-prog-${i}`,
      title: programTitles[(channel.id.charCodeAt(8) + i) % programTitles.length],
      startTime,
      endTime,
      isLive,
      isPast,
    });
  }
  
  return programs;
}

export function TVGuide({ channels, onChannelClick }: TVGuideProps) {
  const [expandedChannel, setExpandedChannel] = useState<string | null>(null);
  
  // Show first 10 channels in guide
  const guideChannels = channels.slice(0, 10);

  return (
    <section className="container px-4 mb-10">
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="w-5 h-5 text-primary" />
        <h2 className="font-display text-xl font-semibold">TV Guide</h2>
        <span className="text-sm text-muted-foreground ml-auto">
          {format(new Date(), 'EEEE, MMM d')}
        </span>
      </div>

      <div className="space-y-2">
        {guideChannels.map(channel => {
          const programs = generateMockPrograms(channel);
          const currentProgram = programs.find(p => p.isLive);
          const isExpanded = expandedChannel === channel.id;

          return (
            <div 
              key={channel.id}
              className="bg-secondary/50 rounded-xl overflow-hidden border border-border/50"
            >
              {/* Channel header */}
              <div 
                className="flex items-center gap-4 p-4 cursor-pointer hover:bg-secondary/80 transition-colors"
                onClick={() => setExpandedChannel(isExpanded ? null : channel.id)}
              >
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                  {channel.logo ? (
                    <img src={channel.logo} alt={channel.name} className="w-full h-full object-contain p-1" />
                  ) : (
                    <Tv className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium truncate">{channel.name}</h3>
                    {currentProgram && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-medium">
                        <Radio className="w-2.5 h-2.5 animate-pulse" />
                        LIVE
                      </span>
                    )}
                  </div>
                  {currentProgram && (
                    <p className="text-sm text-muted-foreground truncate">
                      {currentProgram.title} • Until {format(currentProgram.endTime, 'h:mm a')}
                    </p>
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onChannelClick(channel);
                  }}
                  className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Watch
                </button>

                <ChevronRight className={cn(
                  'w-5 h-5 text-muted-foreground transition-transform',
                  isExpanded && 'rotate-90'
                )} />
              </div>

              {/* Expanded schedule */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-border/50">
                  <div className="pt-3 space-y-2">
                    {programs.map(program => (
                      <div 
                        key={program.id}
                        className={cn(
                          'flex items-center gap-3 p-3 rounded-lg transition-colors',
                          program.isLive && 'bg-primary/10 border border-primary/30',
                          program.isPast && 'opacity-50'
                        )}
                      >
                        <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm text-muted-foreground w-24">
                          {format(program.startTime, 'h:mm a')}
                        </span>
                        <span className={cn(
                          'text-sm flex-1',
                          program.isLive && 'font-medium text-primary'
                        )}>
                          {program.title}
                        </span>
                        {program.isLive && (
                          <span className="text-xs text-primary font-medium">Now Playing</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
