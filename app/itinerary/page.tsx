'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { INDIA_DESTINATIONS } from '@/lib/india-destinations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Download, MapPin, Calendar, DollarSign, AlertCircle, TrendingUp } from 'lucide-react';

type CostTier = 'budget' | 'mid' | 'luxury';

interface TripDestination {
  id: string;
  days: number;
  costTier: CostTier;
}

interface TripCalculation {
  destination: (typeof INDIA_DESTINATIONS)[0];
  days: number;
  costTier: CostTier;
  totalCost: number;
  costBreakdown: {
    accommodation: number;
    food: number;
    transport: number;
    activities: number;
  };
}

export default function ItineraryPage() {
  const [tripName, setTripName] = useState('My Indian Adventure');
  const [selectedDestinations, setSelectedDestinations] = useState<TripDestination[]>([]);
  const [budgetMode, setBudgetMode] = useState<'build' | 'search'>('build');
  const [totalBudget, setTotalBudget] = useState<number | string>('');
  const [suggestedDestinations, setSuggestedDestinations] = useState<TripCalculation[]>([]);
  const [searchPerformed, setSearchPerformed] = useState(false);

  // Calculate trip costs
  const tripCalculations = useMemo(() => {
    return selectedDestinations
      .map(sd => {
        const destination = INDIA_DESTINATIONS.find(d => d.id === sd.id);
        if (!destination) return null;

        const costData = destination.costPerDay[sd.costTier];
        return {
          destination,
          days: sd.days,
          costTier: sd.costTier,
          totalCost: costData.total * sd.days,
          costBreakdown: {
            accommodation: costData.accommodation * sd.days,
            food: costData.food * sd.days,
            transport: costData.transport * sd.days,
            activities: costData.activities * sd.days,
          },
        };
      })
      .filter((item): item is TripCalculation => item !== null);
  }, [selectedDestinations]);

  const totalTripCost = useMemo(() => {
    return tripCalculations.reduce((sum, calc) => sum + calc.totalCost, 0);
  }, [tripCalculations]);

  const totalTripDays = useMemo(() => {
    return selectedDestinations.reduce((sum, sd) => sum + sd.days, 0);
  }, [selectedDestinations]);

  // Budget-based recommendations
  const handleBudgetSearch = () => {
    if (!totalBudget || parseInt(totalBudget as string) <= 0) {
      alert('Please enter a valid budget amount');
      return;
    }

    const budget = parseInt(totalBudget as string);
    const recommendations: TripCalculation[] = [];
    let remainingBudget = budget;

    // Sort destinations by popularity (rating + reviews)
    const sortedDests = [...INDIA_DESTINATIONS].sort(
      (a, b) => (b.rating * b.reviews) - (a.rating * a.reviews)
    );

    for (const dest of sortedDests) {
      if (remainingBudget <= 0) break;

      // Try different combinations
      const tiers: CostTier[] = ['budget', 'mid', 'luxury'];
      for (const tier of tiers) {
        const costPerDay = dest.costPerDay[tier].total;
        const maxDays = Math.floor(remainingBudget / costPerDay);

        if (maxDays > 0) {
          const daysToAdd = Math.min(maxDays, 5); // Max 5 days per destination
          const tripCost = costPerDay * daysToAdd;

          if (tripCost <= remainingBudget) {
            const costData = dest.costPerDay[tier];
            recommendations.push({
              destination: dest,
              days: daysToAdd,
              costTier: tier,
              totalCost: tripCost,
              costBreakdown: {
                accommodation: costData.accommodation * daysToAdd,
                food: costData.food * daysToAdd,
                transport: costData.transport * daysToAdd,
                activities: costData.activities * daysToAdd,
              },
            });
            remainingBudget -= tripCost;
            break;
          }
        }
      }
    }

    setSuggestedDestinations(recommendations);
    setSearchPerformed(true);
  };

  const addDestinationFromSuggestion = (calc: TripCalculation) => {
    setSelectedDestinations([
      ...selectedDestinations,
      {
        id: calc.destination.id,
        days: calc.days,
        costTier: calc.costTier,
      },
    ]);
    setSuggestedDestinations(suggestedDestinations.filter(s => s.destination.id !== calc.destination.id));
  };

  const addDestination = (destinationId: string) => {
    if (!selectedDestinations.find(sd => sd.id === destinationId)) {
      setSelectedDestinations([
        ...selectedDestinations,
        { id: destinationId, days: 3, costTier: 'budget' },
      ]);
    }
  };

  const updateDestination = (destinationId: string, field: string, value: any) => {
    setSelectedDestinations(
      selectedDestinations.map(sd =>
        sd.id === destinationId ? { ...sd, [field]: value } : sd
      )
    );
  };

  const removeDestination = (destinationId: string) => {
    setSelectedDestinations(selectedDestinations.filter(sd => sd.id !== destinationId));
  };

  const downloadItinerary = () => {
    let content = `Trip-Sync Itinerary - ${tripName}\n`;
    content += `Generated: ${new Date().toLocaleDateString()}\n`;
    content += `Total Days: ${totalTripDays}\n`;
    content += `Total Cost: ₹${totalTripCost.toLocaleString()}\n`;
    content += `\n`;
    content += `DESTINATIONS:\n`;
    content += `${'='.repeat(80)}\n\n`;

    tripCalculations.forEach((calc, index) => {
      content += `${index + 1}. ${calc.destination.name} (${calc.destination.state})\n`;
      content += `   Days: ${calc.days}\n`;
      content += `   Cost Tier: ${calc.costTier.charAt(0).toUpperCase() + calc.costTier.slice(1)}\n`;
      content += `   Total Cost: ₹${calc.totalCost.toLocaleString()}\n`;
      content += `   Breakdown:\n`;
      content += `   - Accommodation: ₹${calc.costBreakdown.accommodation.toLocaleString()}\n`;
      content += `   - Food: ₹${calc.costBreakdown.food.toLocaleString()}\n`;
      content += `   - Transport: ₹${calc.costBreakdown.transport.toLocaleString()}\n`;
      content += `   - Activities: ₹${calc.costBreakdown.activities.toLocaleString()}\n`;
      content += `   Best Time: ${calc.destination.bestTime}\n`;
      content += `   Top Attractions: ${calc.destination.attractions.slice(0, 3).join(', ')}\n\n`;
    });

    content += `${'='.repeat(80)}\n`;
    content += `TRIP SUMMARY:\n`;
    content += `Total Duration: ${totalTripDays} days\n`;
    content += `Total Cost: ₹${totalTripCost.toLocaleString()}\n`;
    content += `Average Daily Cost: ₹${Math.round(totalTripCost / totalTripDays).toLocaleString()}\n`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tripName.replace(/\s+/g, '-')}-itinerary.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-hero py-12 px-4 text-white">
          <div className="container mx-auto max-w-6xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Plan Your Perfect Trip</h1>
            <p className="text-lg text-white/90 max-w-2xl">Create custom itineraries with real-time cost calculations</p>
          </div>
        </section>

        <div className="container mx-auto max-w-6xl px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Panel - Trip Builder */}
            <div className="lg:col-span-2 space-y-6">
              {/* Trip Name */}
              <Card className="border-0">
                <CardHeader>
                  <CardTitle>Trip Name</CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    value={tripName}
                    onChange={(e) => setTripName(e.target.value)}
                    placeholder="Enter trip name"
                    className="bg-background"
                  />
                </CardContent>
              </Card>

              {/* Mode Selection */}
              <Card className="border-0">
                <CardHeader>
                  <CardTitle>How do you want to plan?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => {
                        setBudgetMode('build');
                        setSuggestedDestinations([]);
                        setSearchPerformed(false);
                      }}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        budgetMode === 'build'
                          ? 'border-primary bg-primary/10'
                          : 'border-muted hover:border-primary/50'
                      }`}
                    >
                      <div className="text-2xl mb-2">🏗️</div>
                      <p className="font-semibold text-foreground">Build Custom Trip</p>
                      <p className="text-xs text-muted-foreground mt-1">Select destinations & costs</p>
                    </button>
                    <button
                      onClick={() => {
                        setBudgetMode('search');
                        setSelectedDestinations([]);
                      }}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        budgetMode === 'search'
                          ? 'border-primary bg-primary/10'
                          : 'border-muted hover:border-primary/50'
                      }`}
                    >
                      <div className="text-2xl mb-2">🎯</div>
                      <p className="font-semibold text-foreground">Budget Search</p>
                      <p className="text-xs text-muted-foreground mt-1">Find destinations by budget</p>
                    </button>
                  </div>
                </CardContent>
              </Card>

              {budgetMode === 'build' ? (
                <>
                  {/* Add Destination */}
                  <Card className="border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Plus className="h-5 w-5" />
                        Add Destinations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                        {INDIA_DESTINATIONS.filter(
                          d => !selectedDestinations.find(sd => sd.id === d.id)
                        ).map(dest => (
                          <button
                            key={dest.id}
                            onClick={() => addDestination(dest.id)}
                            className="text-left p-3 rounded-lg border border-muted hover:border-primary hover:bg-muted/50 transition-all"
                          >
                            <p className="font-semibold text-sm text-foreground">{dest.name}</p>
                            <p className="text-xs text-muted-foreground">{dest.state}</p>
                            <p className="text-xs text-primary mt-1">₹{dest.costPerDay.budget.total}/day</p>
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Selected Destinations Timeline */}
                  {selectedDestinations.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-2xl font-extrabold mb-6 flex items-center gap-2">
                        <span className="bg-primary/10 text-primary p-2 rounded-xl">📍</span> Your Itinerary Route
                      </h3>
                      <div className="space-y-0 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-transparent before:via-primary/30 before:to-transparent">
                        {tripCalculations.map((calc, i) => (
                          <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active py-4">
                            
                            {/* Icon */}
                            <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-background bg-primary/20 group-hover:bg-primary text-primary group-hover:text-primary-foreground shadow-md transition-colors shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                              <span className="font-bold">{i + 1}</span>
                            </div>

                            {/* Card */}
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-5 rounded-3xl border border-border/50 bg-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                              <div className="flex items-start justify-between mb-4">
                                <div>
                                  <h4 className="font-bold text-xl text-foreground">{calc.destination.name}</h4>
                                  <p className="text-sm text-muted-foreground font-medium flex items-center gap-1.5 mt-1">
                                    <MapPin className="h-3.5 w-3.5 text-primary" />
                                    {calc.destination.state}
                                  </p>
                                </div>
                                <button
                                  onClick={() => removeDestination(calc.destination.id)}
                                  className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-xl transition-colors"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              </div>

                              <div className="grid grid-cols-2 gap-4 bg-muted/30 p-3 rounded-2xl">
                                <div>
                                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">Days</label>
                                  <div className="flex items-center bg-background rounded-lg border border-border/50 overflow-hidden">
                                    <input
                                      type="number"
                                      min="1"
                                      max="30"
                                      value={calc.days}
                                      onChange={(e) => updateDestination(calc.destination.id, 'days', parseInt(e.target.value) || 1)}
                                      className="w-full px-3 py-2 text-sm font-semibold outline-none bg-transparent"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">Tier</label>
                                  <div className="flex items-center bg-background rounded-lg border border-border/50 overflow-hidden">
                                    <select
                                      value={calc.costTier}
                                      onChange={(e) => updateDestination(calc.destination.id, 'costTier', e.target.value)}
                                      className="w-full px-3 py-2 text-sm font-semibold outline-none bg-transparent appearance-none"
                                    >
                                      <option value="budget">Budget</option>
                                      <option value="mid">Mid-Range</option>
                                      <option value="luxury">Luxury</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-4 pt-4 border-t border-border/50 flex justify-between items-center">
                                <span className="text-sm font-medium text-muted-foreground">Est. Cost</span>
                                <span className="text-xl font-black text-primary">₹{calc.totalCost.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                // Budget Search Mode
                <Card className="border-0">
                  <CardHeader>
                    <CardTitle>Search by Budget</CardTitle>
                    <CardDescription>Enter your total budget and we&apos;ll suggest the best destinations</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Total Budget (₹)</label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          type="number"
                          value={totalBudget}
                          onChange={(e) => setTotalBudget(e.target.value)}
                          placeholder="Enter total budget"
                          className="bg-background"
                        />
                        <Button onClick={handleBudgetSearch} className="bg-primary hover:bg-primary/90">
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Search
                        </Button>
                      </div>
                    </div>

                    {searchPerformed && suggestedDestinations.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">
                          Found {suggestedDestinations.length} destination combinations
                        </p>
                        {suggestedDestinations.map((calc, i) => (
                          <div
                            key={i}
                            className="p-4 border border-muted rounded-lg flex items-center justify-between hover:bg-muted/50 transition"
                          >
                            <div>
                              <p className="font-semibold text-foreground">{calc.destination.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {calc.days} days • {calc.costTier} tier • ₹{calc.totalCost.toLocaleString()}
                              </p>
                            </div>
                            <Button
                              onClick={() => addDestinationFromSuggestion(calc)}
                              size="sm"
                              className="bg-primary hover:bg-primary/90"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    {searchPerformed && suggestedDestinations.length === 0 && selectedDestinations.length === 0 && (
                      <div className="p-4 border border-muted rounded-lg bg-muted/30">
                        <p className="text-sm text-muted-foreground text-center">
                          No perfect matches found. Try adjusting your budget.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Panel - Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Trip Summary Premium Card */}
                <Card className="border-0 overflow-hidden rounded-3xl shadow-2xl relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-primary opacity-90"></div>
                  {/* Glassmorphism overlay */}
                  <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]"></div>
                  
                  <CardContent className="p-8 relative z-10 text-white space-y-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-extrabold text-2xl tracking-tight text-white drop-shadow-md">Trip Summary</h3>
                      <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                        <MapPin className="h-5 w-5 text-white" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-md border border-white/10 text-center">
                        <p className="text-xs font-bold uppercase tracking-widest text-white/70 mb-1">Stops</p>
                        <p className="text-3xl font-black">{selectedDestinations.length}</p>
                      </div>
                      <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-md border border-white/10 text-center">
                        <p className="text-xs font-bold uppercase tracking-widest text-white/70 mb-1">Days</p>
                        <p className="text-3xl font-black">{totalTripDays}</p>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/20">
                      <p className="text-sm font-bold uppercase tracking-widest text-white/80 mb-2">Estimated Total</p>
                      <p className="text-5xl font-black drop-shadow-lg tracking-tight">
                        ₹{totalTripCost.toLocaleString()}
                      </p>
                      {totalTripDays > 0 && (
                        <div className="mt-3 inline-flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md border border-white/10">
                          <span>₹{Math.round(totalTripCost / totalTripDays).toLocaleString()}</span>
                          <span className="text-white/80 font-medium">/ day</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Cost Breakdown */}
                {tripCalculations.length > 0 && (
                  <Card className="border border-border/50 shadow-lg rounded-3xl overflow-hidden bg-card/50 backdrop-blur-md">
                    <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
                      <CardTitle className="text-lg font-extrabold flex items-center gap-2">
                        <span className="text-xl">💰</span> Cost Breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors">
                        <span className="text-sm font-bold flex items-center gap-2"><span className="text-lg">🏨</span> Stays</span>
                        <span className="font-black">₹{tripCalculations.reduce((s, c) => s + c.costBreakdown.accommodation, 0).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors">
                        <span className="text-sm font-bold flex items-center gap-2"><span className="text-lg">🍽️</span> Food</span>
                        <span className="font-black">₹{tripCalculations.reduce((s, c) => s + c.costBreakdown.food, 0).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors">
                        <span className="text-sm font-bold flex items-center gap-2"><span className="text-lg">🚌</span> Transit</span>
                        <span className="font-black">₹{tripCalculations.reduce((s, c) => s + c.costBreakdown.transport, 0).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors">
                        <span className="text-sm font-bold flex items-center gap-2"><span className="text-lg">🎫</span> Extras</span>
                        <span className="font-black">₹{tripCalculations.reduce((s, c) => s + c.costBreakdown.activities, 0).toLocaleString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Action Buttons */}
                {selectedDestinations.length > 0 && (
                  <div className="space-y-3">
                    <Button onClick={downloadItinerary} className="w-full bg-primary hover:bg-primary/90">
                      <Download className="h-4 w-4 mr-2" />
                      Download Itinerary
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/community">Share & Get Tips</Link>
                    </Button>
                  </div>
                )}

                {selectedDestinations.length === 0 && budgetMode === 'build' && (
                  <Card className="border-0 bg-muted/30">
                    <CardContent className="p-4 text-center">
                      <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">
                        Add destinations to get started with your trip planning
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
