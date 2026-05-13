'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { MapPin, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Explore', path: '/explore' },
    { name: 'Plan Trip', path: '/itinerary' },
    { name: 'Budget', path: '/budget' },
    { name: 'Community', path: '/community' },
  ];

  if (!mounted) {
    return (
      <header className="fixed top-0 z-50 w-full h-16" />
    );
  }

  return (
    <div className="fixed top-0 inset-x-0 z-50 flex justify-center w-full px-4 pt-4 transition-all duration-300">
      <header 
        className={`w-full max-w-6xl rounded-2xl border transition-all duration-500 overflow-hidden
        ${scrolled 
          ? 'bg-background/70 backdrop-blur-xl shadow-lg border-border/50 py-3 px-6' 
          : 'bg-background/40 backdrop-blur-sm border-transparent py-4 px-6 shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Trip-Sync
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link 
                  key={link.name}
                  href={link.path} 
                  className="relative group py-1"
                >
                  <span className={`text-sm font-semibold transition-colors ${
                    isActive ? 'text-primary' : 'text-foreground/70 group-hover:text-foreground'
                  }`}>
                    {link.name}
                  </span>
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ease-out ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </Link>
              );
            })}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-full hover:bg-muted/50"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-slate-700" />
              )}
            </Button>

            {/* CTA Button */}
            <Button asChild className="bg-primary text-primary-foreground font-bold shadow-md hover:shadow-lg hover:bg-primary/90 transition-all rounded-xl">
              <Link href="/explore">Start Exploring</Link>
            </Button>
          </div>
        </div>
      </header>
    </div>
  );
}
