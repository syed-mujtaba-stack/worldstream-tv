import { Globe, Search, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export function Header() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-strong safe-area-top">
      <div className="container flex items-center justify-between h-14 px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20">
            <Globe className="w-5 h-5 text-primary" />
          </div>
          <span className="font-display font-bold text-lg">World TV</span>
        </Link>

        <div className="hidden md:flex items-center gap-4">
          <Link 
            to="/search" 
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Search
          </Link>
          <Link 
            to="/favorites" 
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Favorites
          </Link>
          {user ? (
            <Link to="/profile">
              <Button variant="outline" size="sm">Profile</Button>
            </Link>
          ) : (
            <Button 
              size="sm" 
              onClick={() => navigate('/auth')}
              className="btn-primary"
            >
              Sign In
            </Button>
          )}
        </div>

        <button 
          className="md:hidden p-2 text-muted-foreground hover:text-foreground"
          onClick={() => navigate('/search')}
        >
          <Search className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
