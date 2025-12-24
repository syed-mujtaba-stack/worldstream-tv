import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { User, LogOut, Heart, Globe } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useFavorites } from '@/hooks/useFavorites';

export default function Profile() {
  const { user, signOut } = useAuth();
  const { favorites } = useFavorites();
  const navigate = useNavigate();

  if (!user) return <Navigate to="/auth" replace />;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen pt-14 pb-20 md:pb-8">
      <div className="container px-4 py-6 max-w-md mx-auto">
        <div className="card-elevated p-6 text-center mb-6">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-primary" />
          </div>
          <h1 className="font-display text-xl font-bold">{user.email}</h1>
          <p className="text-sm text-muted-foreground mt-1">Member</p>
        </div>

        <div className="card-elevated p-4 mb-6">
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-primary" />
              <span>Favorites</span>
            </div>
            <span className="font-semibold">{favorites.length}</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-primary" />
              <span>Status</span>
            </div>
            <span className="text-primary font-medium">Active</span>
          </div>
        </div>

        <Button onClick={handleSignOut} variant="destructive" className="w-full">
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
