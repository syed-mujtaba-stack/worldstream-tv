import { cn } from '@/lib/utils';
import { 
  Newspaper, 
  Trophy, 
  Film, 
  Music, 
  Tv, 
  Baby, 
  Church,
  BookOpen,
  Gamepad2,
  Sparkles,
  Globe,
  ShoppingBag,
  Sunrise,
  Radio
} from 'lucide-react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'All': <Tv className="w-4 h-4" />,
  'News': <Newspaper className="w-4 h-4" />,
  'Sports': <Trophy className="w-4 h-4" />,
  'Movies': <Film className="w-4 h-4" />,
  'Music': <Music className="w-4 h-4" />,
  'Entertainment': <Sparkles className="w-4 h-4" />,
  'Kids': <Baby className="w-4 h-4" />,
  'Religious': <Church className="w-4 h-4" />,
  'Documentary': <BookOpen className="w-4 h-4" />,
  'Gaming': <Gamepad2 className="w-4 h-4" />,
  'General': <Globe className="w-4 h-4" />,
  'Shop': <ShoppingBag className="w-4 h-4" />,
  'Lifestyle': <Sunrise className="w-4 h-4" />,
  'Animation': <Baby className="w-4 h-4" />,
  'Classic': <Radio className="w-4 h-4" />,
};

// Priority categories to show first
const PRIORITY_CATEGORIES = [
  'News', 'Sports', 'Movies', 'Music', 'Entertainment', 
  'Kids', 'Documentary', 'Religious', 'General', 'Animation',
  'Shop', 'Lifestyle', 'Classic', 'Gaming'
];

export function CategoryFilter({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) {
  // Sort categories by priority
  const sortedCategories = [...categories].sort((a, b) => {
    const aIndex = PRIORITY_CATEGORIES.indexOf(a);
    const bIndex = PRIORITY_CATEGORIES.indexOf(b);
    if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => onCategoryChange('all')}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
          selectedCategory === 'all'
            ? 'bg-primary text-primary-foreground shadow-glow'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
        )}
      >
        {CATEGORY_ICONS['All']}
        All
      </button>
      {sortedCategories.slice(0, 15).map(category => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
            selectedCategory === category
              ? 'bg-primary text-primary-foreground shadow-glow'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          )}
        >
          {CATEGORY_ICONS[category] || <Tv className="w-4 h-4" />}
          {category}
        </button>
      ))}
    </div>
  );
}
