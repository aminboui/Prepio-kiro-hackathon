'use client';

import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface NavBarProps {
  onGetStarted?: () => void;
  showGetStarted?: boolean;
  showNavLinks?: boolean;
  showLogout?: boolean;
}

export default function NavBar({ 
  onGetStarted, 
  showGetStarted = true, 
  showNavLinks = true,
  showLogout = false 
}: NavBarProps) {
  
  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
      window.location.href = '/';
    }
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mt-3 flex items-center justify-between rounded-xl border border-border/60 bg-card/70 px-4 py-2.5 backdrop-blur">
          
          {/* Logo section */}
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-md text-orange-600 font-bold text-lg">
              {`{P}`}
            </span>
            <span className="font-bold text-xl text-foreground">Prepio</span>
          </Link>

          {showNavLinks && (
            <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
              <a className="hover:text-foreground" href="#features">Features</a>
              <a className="hover:text-foreground" href="#deep-dive">How it works</a>
              <a className="hover:text-foreground" href="#skill">Skill Builder</a>
              <a className="hover:text-foreground" href="#faq">FAQ</a>
            </nav>
          )}

          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden bg-transparent sm:inline-flex" 
              asChild
            >
              <Link href="/profile">My Profile</Link>
            </Button>
            {showGetStarted && onGetStarted && (
              <Button size="sm" onClick={onGetStarted}>
                Get Started
              </Button>
            )}
            {showLogout && (
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
