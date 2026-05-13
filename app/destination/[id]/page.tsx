'use client';

import { useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/header';
import { INDIA_DESTINATIONS } from '@/lib/india-destinations';
import { getFallbackImageForDestination } from '@/lib/image-utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Calendar, DollarSign, Utensils, MapPinIcon, ArrowRight, Check } from 'lucide-react';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

const COST_TIERS = [
  { name: 'Budget', key: 'budget', color: 'from-green-600 to-emerald-500', icon: '🏖️' },
  { name: 'Mid-Range', key: 'mid', color: 'from-blue-600 to-cyan-500', icon: '🏨' },
  { name: 'Luxury', key: 'luxury', color: 'from-purple-600 to-pink-500', icon: '⭐' },
];

export default function DestinationDetailPage({ params }: Props) {
  const { id } = use(params);
  const destination = INDIA_DESTINATIONS.find(d => d.id === id);
  const [selectedTier, setSelectedTier] = useState<'budget' | 'mid' | 'luxury'>('budget');
  const [days, setDays] = useState(5);

  if (!destination) {
    notFound();
  }

  const costData = destination.costPerDay[selectedTier];
  const totalCost = costData.total * days;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section with Immersive Image */}
        <section className="relative h-[60vh] min-h-[500px] bg-muted overflow-hidden">
          <Image
            src={destination.image}
            alt={destination.name}
            fill
            className="object-cover object-center"
            priority
            onError={(e) => {
              // Dynamic fallback based on destination type
              e.currentTarget.src = getFallbackImageForDestination(destination);
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-black/40 to-transparent"></div>

          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <div className="container mx-auto max-w-6xl">
              <div className="flex flex-col items-start gap-4">
                <div className="flex items-center gap-3 backdrop-blur-md bg-white/10 px-4 py-2 rounded-full border border-white/20">
                  <Badge className="bg-yellow-400 text-gray-900 border-0 font-bold px-2 py-0.5 shadow-sm">
                    <Star className="h-3.5 w-3.5 mr-1 fill-current" />
                    {destination.rating}
                  </Badge>
                  <span className="text-white/90 text-sm font-medium">{destination.reviews} reviews</span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight text-balance drop-shadow-md">
                  {destination.name}
                </h1>
                
                <div className="flex items-center gap-2 text-xl text-white/90 font-medium backdrop-blur-md bg-black/20 px-4 py-2 rounded-lg border border-white/10">
                  <MapPin className="h-5 w-5 text-yellow-400" />
                  {destination.state}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content - Bento Grid */}
        <div className="container mx-auto max-w-6xl px-4 py-12 -mt-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column - Info Grid */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* About - Full Width Bento */}
              <Card className="border border-border/50 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden">
                <CardHeader className="bg-primary/5 border-b border-primary/10 pb-4">
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <span className="text-primary">✨</span> About {destination.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-foreground/90 text-lg leading-relaxed font-medium">{destination.description}</p>
                </CardContent>
              </Card>

              {/* 2-Column Bento Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Best Time to Visit */}
                <Card className="border border-border/50 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 rounded-2xl group">
                  <CardHeader className="pb-3">
                    <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Calendar className="h-6 w-6 text-blue-500" />
                    </div>
                    <CardTitle className="text-xl">Best Time to Visit</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/80 font-medium text-lg">{destination.bestTime}</p>
                  </CardContent>
                </Card>

                {/* Top Attractions */}
                <Card className="border border-border/50 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 rounded-2xl group">
                  <CardHeader className="pb-3">
                    <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <MapPinIcon className="h-6 w-6 text-emerald-500" />
                    </div>
                    <CardTitle className="text-xl">Top Attractions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2.5">
                      {destination.attractions.map((attraction, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="mt-1 bg-emerald-500/20 rounded-full p-0.5">
                            <Check className="h-3 w-3 text-emerald-600" />
                          </div>
                          <span className="text-foreground/90 font-medium">{attraction}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Local Food */}
                <Card className="border border-border/50 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 rounded-2xl group">
                  <CardHeader className="pb-3">
                    <div className="h-12 w-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Utensils className="h-6 w-6 text-orange-500" />
                    </div>
                    <CardTitle className="text-xl">Must Try Food</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {destination.food.map((food, i) => (
                        <span key={i} className="px-3 py-1.5 bg-orange-500/10 text-orange-700 dark:text-orange-400 rounded-lg text-sm font-semibold">
                          {food}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Experiences */}
                <Card className="border border-border/50 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 rounded-2xl group">
                  <CardHeader className="pb-3">
                    <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Star className="h-6 w-6 text-purple-500" />
                    </div>
                    <CardTitle className="text-xl">Experiences</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {destination.experiences.map((exp, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <span className="text-xl">✨</span>
                          <span className="text-foreground/90 font-medium">{exp}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Accommodations & Dining Blocks */}
              {(destination.hotels?.length > 0 || destination.restaurants?.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  {destination.hotels && destination.hotels.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold flex items-center gap-2">
                        <span className="p-2 bg-muted rounded-lg">🏨</span> Top Stays
                      </h3>
                      <div className="flex flex-col gap-2">
                        {destination.hotels.slice(0,4).map((hotel, i) => (
                          <div key={i} className="p-3 bg-card border border-border/50 rounded-xl hover:border-primary/50 transition-colors shadow-sm font-medium text-foreground/90">
                            {hotel}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {destination.restaurants && destination.restaurants.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold flex items-center gap-2">
                        <span className="p-2 bg-muted rounded-lg">🍽️</span> Dining
                      </h3>
                      <div className="flex flex-col gap-2">
                        {destination.restaurants.slice(0,4).map((restaurant, i) => (
                          <div key={i} className="p-3 bg-card border border-border/50 rounded-xl hover:border-primary/50 transition-colors shadow-sm font-medium text-foreground/90">
                            {restaurant}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column - Premium Sticky Cost Tiers */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 space-y-6">
                
                {/* Cost Tier Selector */}
                <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm">
                  <h3 className="text-2xl font-bold text-foreground mb-4">Daily Budget</h3>
                  <div className="flex flex-col gap-3">
                    {COST_TIERS.map(tier => (
                      <button
                        key={tier.key}
                        onClick={() => setSelectedTier(tier.key as 'budget' | 'mid' | 'luxury')}
                        className={`w-full text-left transition-all duration-300 p-4 rounded-xl border-2 flex items-center justify-between group ${
                          selectedTier === tier.key
                            ? 'border-primary bg-primary/5 shadow-sm'
                            : 'border-transparent bg-muted/50 hover:bg-muted'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl bg-background p-2 rounded-lg shadow-sm group-hover:scale-110 transition-transform">{tier.icon}</span>
                          <span className={`font-bold ${selectedTier === tier.key ? 'text-primary' : 'text-foreground'}`}>
                            {tier.name}
                          </span>
                        </div>
                        {selectedTier === tier.key && (
                          <div className="h-2 w-2 rounded-full bg-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected Tier Details - Premium Card */}
                <Card className={`border-0 shadow-xl overflow-hidden rounded-2xl relative transition-colors duration-500`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${COST_TIERS.find(t => t.key === selectedTier)?.color || 'from-blue-600 to-cyan-500'} opacity-90`}></div>
                  <CardContent className="p-6 text-white relative z-10">
                    <div className="flex justify-between items-end mb-6">
                      <div>
                        <p className="text-sm text-white/80 font-medium mb-1 uppercase tracking-wider">Total Per Day</p>
                        <p className="text-4xl font-extrabold tracking-tight">₹{costData.total}</p>
                      </div>
                      <span className="text-3xl opacity-50">{COST_TIERS.find(t => t.key === selectedTier)?.icon}</span>
                    </div>

                    <div className="space-y-4 bg-black/20 backdrop-blur-md rounded-xl p-5 border border-white/10">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2"><span className="opacity-80">🏨</span> Accommodation</span>
                        <span className="font-bold">₹{costData.accommodation}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2"><span className="opacity-80">🍽️</span> Food</span>
                        <span className="font-bold">₹{costData.food}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2"><span className="opacity-80">🚌</span> Transport</span>
                        <span className="font-bold">₹{costData.transport}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2"><span className="opacity-80">🎫</span> Activities</span>
                        <span className="font-bold">₹{costData.activities}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Plan Your Trip */}
                <Card className="border border-border/50 shadow-sm rounded-2xl overflow-hidden">
                  <div className="bg-primary/5 p-5 border-b border-border/50">
                    <CardTitle className="text-xl font-bold">Plan Your Trip</CardTitle>
                  </div>
                  <CardContent className="p-5 space-y-5">
                    <div>
                      <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Trip Duration (Days)</label>
                      <div className="flex items-center gap-3 mt-3 bg-muted/30 p-2 rounded-xl border border-border/50">
                        <button
                          onClick={() => setDays(Math.max(1, days - 1))}
                          className="h-10 w-10 flex items-center justify-center rounded-lg bg-background border border-border shadow-sm hover:bg-muted transition-colors text-lg font-medium"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min="1"
                          max="30"
                          value={days}
                          onChange={(e) => setDays(Math.max(1, parseInt(e.target.value) || 1))}
                          className="flex-1 bg-transparent text-center text-xl font-bold outline-none"
                        />
                        <button
                          onClick={() => setDays(Math.min(30, days + 1))}
                          className="h-10 w-10 flex items-center justify-center rounded-lg bg-background border border-border shadow-sm hover:bg-muted transition-colors text-lg font-medium"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-primary/10 rounded-xl border border-primary/20">
                      <div>
                        <p className="text-sm font-semibold text-primary">Estimated Trip Cost</p>
                        <p className="text-xs text-primary/70">Based on {selectedTier} tier</p>
                      </div>
                      <p className="text-2xl font-black text-primary">
                        ₹{totalCost.toLocaleString()}
                      </p>
                    </div>

                    <Button asChild className="w-full h-12 text-lg font-bold shadow-md hover:shadow-lg transition-all group rounded-xl">
                      <Link href="/itinerary">
                        Start Planning
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Similar Destinations */}
          <div className="mt-20 pt-12 border-t border-border/50">
            <h2 className="text-3xl font-extrabold text-foreground mb-8">More to Explore in {destination.state}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {INDIA_DESTINATIONS.filter(d => d.state === destination.state && d.id !== destination.id).slice(0, 3).map(similar => (
                <Link key={similar.id} href={`/destination/${similar.id}`}>
                  <Card className="overflow-hidden hover-lift transition-all duration-300 h-full hover:shadow-xl border border-border/50 rounded-2xl group">
                    <div className="relative h-48 bg-muted overflow-hidden">
                      <Image
                        src={similar.image}
                        alt={similar.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.src = getFallbackImageForDestination(similar);
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      <div className="absolute bottom-4 left-4">
                        <p className="text-white font-bold text-xl">{similar.name}</p>
                      </div>
                    </div>
                    <CardContent className="p-4 bg-card">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 bg-primary/10 px-2.5 py-1 rounded-md text-primary">
                          <DollarSign className="h-4 w-4" />
                          <span className="text-sm font-bold">₹{similar.costPerDay.budget.total}/day</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-yellow-400/10 px-2.5 py-1 rounded-md text-yellow-600 dark:text-yellow-400">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="text-sm font-bold">{similar.rating}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
