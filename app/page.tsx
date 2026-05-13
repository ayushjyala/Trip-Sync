'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/header';
import { DestinationCard } from '@/components/destination-card';
import { INDIA_DESTINATIONS } from '@/lib/india-destinations';
import { getFallbackImageForDestination } from '@/lib/image-utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, MapPin, DollarSign, Users, Compass, Clock, Star, Calendar } from 'lucide-react';

const featuredDestinations = INDIA_DESTINATIONS.slice(0, 6);
const regions = [
  { name: 'North', color: 'from-blue-600 to-cyan-500', icon: '⛰️', destinations: 12 },
  { name: 'South', color: 'from-green-600 to-emerald-500', icon: '🏝️', destinations: 10 },
  { name: 'East', color: 'from-purple-600 to-pink-500', icon: '🌅', destinations: 8 },
  { name: 'West', color: 'from-orange-600 to-yellow-500', icon: '🏜️', destinations: 11 },
  { name: 'Northeast', color: 'from-teal-600 to-cyan-500', icon: '🌿', destinations: 7 },
  { name: 'Central', color: 'from-red-600 to-orange-500', icon: '🏛️', destinations: 9 },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Cinematic Hero Section */}
        <section className="relative min-h-[90vh] flex items-center pt-20 px-4 overflow-hidden">
          {/* Stunning Background Image */}
          <Image
            src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=2000"
            alt="Beautiful Indian Landscape"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background"></div>
          
          <div className="container mx-auto max-w-5xl relative z-10 flex flex-col items-center justify-center h-full pb-10">
            <div className="text-center space-y-8 p-8 md:p-12 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl animate-fade-in-up">
              <div className="inline-block mb-4 animate-bounce-slow">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-6 py-2 rounded-full text-sm font-extrabold tracking-wider uppercase shadow-lg shadow-yellow-500/20">
                  Premium Travel Experience
                </span>
              </div>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white text-balance leading-tight tracking-tight drop-shadow-lg">
                Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600">Incredible</span> India
              </h1>
              
              <p className="text-xl md:text-2xl text-white/90 text-balance max-w-3xl mx-auto font-medium leading-relaxed drop-shadow">
                Plan the perfect adventure with real-time budget estimates, AI-curated itineraries, and a vibrant community.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5 justify-center pt-8">
                <Button asChild size="lg" className="h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg rounded-xl shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <Link href="/explore">
                    <Compass className="mr-2 h-6 w-6" />
                    Start Exploring
                  </Link>
                </Button>
                <Button asChild size="lg" className="h-14 px-8 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md font-bold text-lg rounded-xl shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <Link href="/itinerary">
                    <Calendar className="mr-2 h-6 w-6" />
                    Plan Your Trip
                  </Link>
                </Button>
              </div>

              {/* Floating Stats */}
              <div className="grid grid-cols-3 gap-8 pt-12 mt-8 border-t border-white/10">
                <div className="text-white group">
                  <div className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 group-hover:scale-110 transition-transform">100+</div>
                  <div className="text-sm uppercase tracking-widest font-semibold text-yellow-400 mt-2">Destinations</div>
                </div>
                <div className="text-white group border-x border-white/10">
                  <div className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 group-hover:scale-110 transition-transform">28</div>
                  <div className="text-sm uppercase tracking-widest font-semibold text-yellow-400 mt-2">States</div>
                </div>
                <div className="text-white group">
                  <div className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 group-hover:scale-110 transition-transform">∞</div>
                  <div className="text-sm uppercase tracking-widest font-semibold text-yellow-400 mt-2">Memories</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Destinations Premium Grid */}
        <section className="py-24 px-4 bg-background relative z-20">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <span className="text-primary font-bold tracking-widest uppercase text-sm mb-2 block">Curated For You</span>
              <h2 className="text-4xl md:text-6xl font-extrabold text-foreground mb-6 tracking-tight">Featured Destinations</h2>
              <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-medium">
                Explore India&apos;s most iconic, breathtaking locations handpicked by our travel experts.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredDestinations.map((destination) => (
                <Link key={destination.id} href={`/destination/${destination.id}`}>
                  <Card className="overflow-hidden group h-full rounded-3xl border-0 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 bg-card">
                    <div className="relative h-64 bg-muted overflow-hidden">
                      <Image
                        src={destination.image}
                        alt={destination.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        onError={(e) => {
                          e.currentTarget.src = getFallbackImageForDestination(destination);
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 rounded-full p-2.5 shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                        <Star className="h-5 w-5 fill-current" />
                      </div>
                      
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-yellow-400 transition-colors">{destination.name}</h3>
                        <div className="flex items-center gap-1.5 text-white/90 font-medium">
                          <MapPin className="h-4 w-4 text-yellow-400" />
                          {destination.state}
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-6 space-y-4">
                      <p className="text-muted-foreground line-clamp-2 text-base leading-relaxed">{destination.description}</p>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-border/50">
                        <div className="flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-lg text-primary">
                          <DollarSign className="h-4 w-4" />
                          <span className="text-sm font-bold">₹{destination.costPerDay.budget.total}/day</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-yellow-400/10 px-3 py-1.5 rounded-lg text-yellow-600 dark:text-yellow-400">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="text-sm font-bold">{destination.rating}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="flex justify-center mt-16">
              <Button asChild size="lg" variant="outline" className="h-14 px-8 border-2 border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground font-bold text-lg rounded-xl transition-all duration-300 group shadow-sm hover:shadow-xl">
                <Link href="/explore">
                  View All 100+ Destinations
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Regions */}
        <section className="py-16 md:py-24 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Explore by Region</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Discover destinations organized by India&apos;s diverse regions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regions.map((region, index) => (
                <button
                  key={index}
                  onClick={() => {
                    // Navigate to explore page with region filter
                    window.location.href = `/explore?region=${region.name}`;
                  }}
                  className={`relative h-40 rounded-xl overflow-hidden group cursor-pointer`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${region.color} opacity-90 group-hover:opacity-100 transition-opacity duration-300`}></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                    <span className="text-5xl mb-3">{region.icon}</span>
                    <h3 className="text-2xl font-bold text-center">{region.name}</h3>
                    <p className="text-sm mt-2 text-white/80">{region.destinations} destinations</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 md:py-24 px-4 bg-background">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Why Choose Trip-Sync?</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Everything you need for an amazing travel experience
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: <MapPin className="h-8 w-8" />,
                  title: 'Comprehensive Coverage',
                  description: '100+ destinations across all 28 Indian states and union territories'
                },
                {
                  icon: <DollarSign className="h-8 w-8" />,
                  title: 'Smart Budget Planning',
                  description: 'Get real-time cost estimates with budget, mid-range & luxury options'
                },
                {
                  icon: <Calendar className="h-8 w-8" />,
                  title: 'Smart Itineraries',
                  description: 'Create and customize multi-destination trips with cost tracking'
                },
                {
                  icon: <Users className="h-8 w-8" />,
                  title: 'Community Reviews',
                  description: 'Connect with travelers and discover authentic local experiences'
                },
              ].map((feature, index) => (
                <Card key={index} className="border-0 bg-gradient-to-br from-primary/5 to-accent/5 hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="text-primary mb-3">{feature.icon}</div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 px-4 bg-gradient-hero">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 text-balance">
              Ready to Explore India?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto text-balance">
              Start planning your perfect Indian adventure today. Discover destinations, create itineraries, and connect with fellow travelers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-gray-900 hover:bg-gray-100 font-semibold text-base">
                <Link href="/explore">
                  Start Exploring
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link href="/budget">Calculate Budget</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-foreground/5 text-foreground py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-lg mb-4">Trip-Sync</h4>
              <p className="text-sm text-muted-foreground">Your trusted companion for exploring India</p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Quick Links</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/explore" className="hover:text-primary transition">Explore</Link></li>
                <li><Link href="/itinerary" className="hover:text-primary transition">Plan Trip</Link></li>
                <li><Link href="/budget" className="hover:text-primary transition">Budget</Link></li>
                <li><Link href="/community" className="hover:text-primary transition">Community</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Popular</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/destination/jaipur" className="hover:text-primary transition">Jaipur</Link></li>
                <li><Link href="/destination/agra" className="hover:text-primary transition">Agra</Link></li>
                <li><Link href="/destination/manali" className="hover:text-primary transition">Manali</Link></li>
                <li><Link href="/destination/kochi" className="hover:text-primary transition">Kochi</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Connect</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition">Twitter</a></li>
                <li><a href="#" className="hover:text-primary transition">Facebook</a></li>
                <li><a href="#" className="hover:text-primary transition">Instagram</a></li>
                <li><a href="#" className="hover:text-primary transition">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2026 Trip-Sync. All rights reserved. | Your journey begins here.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
