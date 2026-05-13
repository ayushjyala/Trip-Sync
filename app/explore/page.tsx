'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/header';
import { INDIA_DESTINATIONS } from '@/lib/india-destinations';
import { getFallbackImageForDestination } from '@/lib/image-utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MapPin, DollarSign, Search, Star, Calendar } from 'lucide-react';

const COST_RANGES = [
  { label: 'Budget (₹0-500)', min: 0, max: 500 },
  { label: 'Mid-Range (₹500-1000)', min: 500, max: 1000 },
  { label: 'Luxury (₹1000+)', min: 1000, max: Infinity },
];

const STATES = Array.from(new Set(INDIA_DESTINATIONS.map(d => d.state))).sort();

export default function ExplorePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCostRange, setSelectedCostRange] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('rating');

  const filteredDestinations = useMemo(() => {
    let results = INDIA_DESTINATIONS;

    // Search filter
    if (searchTerm) {
      results = results.filter(d =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // State filter
    if (selectedState) {
      results = results.filter(d => d.state === selectedState);
    }

    // Cost range filter
    if (selectedCostRange) {
      const range = COST_RANGES.find(r => r.label === selectedCostRange);
      if (range) {
        results = results.filter(d => {
          const cost = d.costPerDay.budget.total;
          return cost >= range.min && cost < range.max;
        });
      }
    }

    // Rating filter
    if (minRating > 0) {
      results = results.filter(d => d.rating >= minRating);
    }

    // Sort
    results.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'price-low':
          return a.costPerDay.budget.total - b.costPerDay.budget.total;
        case 'price-high':
          return b.costPerDay.budget.total - a.costPerDay.budget.total;
        case 'reviews':
          return b.reviews - a.reviews;
        default:
          return 0;
      }
    });

    return results;
  }, [searchTerm, selectedState, selectedCostRange, minRating, sortBy]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-hero py-16 px-4 text-white">
          <div className="container mx-auto max-w-6xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white drop-shadow-lg text-balance">Explore Indian Destinations</h1>
            <p className="text-xl text-white/95 max-w-2xl drop-shadow-md">Discover {INDIA_DESTINATIONS.length}+ amazing places across all Indian states</p>
          </div>
        </section>

        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-8 bg-card/50 backdrop-blur-xl p-8 rounded-3xl border border-border/50 shadow-lg">
                <div className="flex items-center gap-3 border-b border-border/50 pb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Search className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-extrabold text-xl text-foreground">Discover</h3>
                </div>

                <div className="space-y-6">
                  {/* Search */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Search Location</label>
                    <div className="relative group">
                      <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        placeholder="Where to?"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 h-12 bg-background/50 border-border/50 hover:border-primary/50 focus:border-primary rounded-xl transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  {/* State Filter */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Region / State</label>
                    <div className="relative">
                      <select
                        value={selectedState}
                        onChange={(e) => setSelectedState(e.target.value)}
                        className="w-full h-12 pl-4 pr-10 appearance-none rounded-xl border border-border/50 bg-background/50 hover:border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm text-foreground cursor-pointer font-medium"
                      >
                        <option value="">All States</option>
                        {STATES.map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-muted-foreground">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                      </div>
                    </div>
                  </div>

                  {/* Budget Filter */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Daily Budget</label>
                    <div className="relative">
                      <select
                        value={selectedCostRange}
                        onChange={(e) => setSelectedCostRange(e.target.value)}
                        className="w-full h-12 pl-4 pr-10 appearance-none rounded-xl border border-border/50 bg-background/50 hover:border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm text-foreground cursor-pointer font-medium"
                      >
                        <option value="">All Budgets</option>
                        {COST_RANGES.map(range => (
                          <option key={range.label} value={range.label}>{range.label}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-muted-foreground">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                      </div>
                    </div>
                  </div>

                  {/* Rating Filter */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex justify-between">
                      <span>Minimum Rating</span>
                      <span className="text-primary">{minRating > 0 ? `${minRating.toFixed(1)}+ Stars` : 'Any'}</span>
                    </label>
                    <div className="pt-2">
                      <input
                        type="range"
                        min="0"
                        max="5"
                        step="0.5"
                        value={minRating}
                        onChange={(e) => setMinRating(parseFloat(e.target.value))}
                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary hover:accent-primary/80 transition-all"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-2 font-medium">
                        <span>Any</span>
                        <span>5.0</span>
                      </div>
                    </div>
                  </div>

                  {/* Sort */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Sort By</label>
                    <div className="relative">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full h-12 pl-4 pr-10 appearance-none rounded-xl border border-border/50 bg-background/50 hover:border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm text-foreground cursor-pointer font-medium"
                      >
                        <option value="rating">Highest Rated</option>
                        <option value="reviews">Most Reviews</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-muted-foreground">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Clear Filters */}
                <div className="pt-4">
                  {(searchTerm || selectedState || selectedCostRange || minRating > 0) ? (
                    <Button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedState('');
                        setSelectedCostRange('');
                        setMinRating(0);
                      }}
                      variant="outline"
                      className="w-full h-12 rounded-xl border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all font-bold"
                    >
                      Clear All Filters
                    </Button>
                  ) : (
                    <div className="h-12 w-full flex items-center justify-center text-sm font-medium text-muted-foreground bg-muted/50 rounded-xl border border-dashed border-border">
                      Adjust filters to refine
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="lg:col-span-3">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">
                  {filteredDestinations.length} Destinations Found
                </h2>
              </div>

              {filteredDestinations.length === 0 ? (
                <Card className="border-0">
                  <CardContent className="py-12 text-center">
                    <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground text-lg mb-4">No destinations found matching your filters.</p>
                    <Button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedState('');
                        setSelectedCostRange('');
                        setMinRating(0);
                      }}
                      variant="outline"
                    >
                      Clear Filters
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredDestinations.map(destination => (
                    <Link key={destination.id} href={`/destination/${destination.id}`}>
                      <Card className="overflow-hidden hover-lift transition-all duration-300 h-full hover:shadow-xl border-0 cursor-pointer">
                        <div className="relative h-56 bg-muted overflow-hidden">
                          <Image
                            src={destination.image}
                            alt={destination.name}
                            fill
                            className="object-cover hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              e.currentTarget.src = getFallbackImageForDestination(destination);
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                          
                          {/* Tags */}
                          <div className="absolute top-3 right-3 flex gap-2">
                            <Badge className="bg-yellow-400 text-gray-900 hover:bg-yellow-300">
                              <Star className="h-3 w-3 mr-1 fill-current" />
                              {destination.rating}
                            </Badge>
                          </div>

                          {/* Title Overlay */}
                          <div className="absolute bottom-3 left-3 right-3">
                            <h3 className="text-xl font-bold text-white text-balance">{destination.name}</h3>
                            <p className="text-sm text-white/80 flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {destination.state}
                            </p>
                          </div>
                        </div>

                        <CardContent className="p-4 space-y-3">
                          <p className="text-sm text-muted-foreground line-clamp-2">{destination.description}</p>
                          
                          {/* Price and Info */}
                          <div className="flex items-center justify-between pt-2 border-t border-border">
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-primary" />
                              <span className="text-sm font-semibold">₹{destination.costPerDay.budget.total}/day</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {destination.bestTime.split(',')[0]}
                            </div>
                          </div>

                          {/* Reviews */}
                          <div className="text-xs text-muted-foreground">
                            {destination.reviews} reviews
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
