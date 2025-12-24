import { Loader2 } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-muted animate-pulse" />
          <Loader2 className="absolute inset-0 m-auto w-8 h-8 text-primary animate-spin" />
        </div>
        <p className="text-muted-foreground font-medium">Loading channels...</p>
      </div>
    </div>
  );
}
