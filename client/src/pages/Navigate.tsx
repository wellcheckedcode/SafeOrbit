import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Navigation, MapPin } from 'lucide-react';
import { useLocation } from 'wouter';
import MapContainer from '@/components/MapContainer';
import { allCrimeData } from '@/data/mockCrimeData';
import { apiRequest } from '@/lib/queryClient';
import type { InsertRouteRequest } from '@shared/schema';

export default function Navigate() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [routeInfo, setRouteInfo] = useState<{ distance: string; time: string; safetyScore: number } | null>(null);

  const handleBack = () => {
    navigate('/');
  };

  // Route planning mutation
  const routePlanningMutation = useMutation({
    mutationFn: async ({ fromLocation, toLocation }: {
      fromLocation: string;
      toLocation: string;
    }) => {
      // Mock geocoding - in real app, use geocoding service
      const mockCoords = {
        from: { lat: 26.8467, lng: 80.9462 }, // Lucknow center
        to: { lat: 26.8750, lng: 80.9750 }   // Different location
      };

      const routeRequestData: InsertRouteRequest = {
        userId: null, // TODO: Get from auth context
        originLat: mockCoords.from.lat.toString(),
        originLng: mockCoords.from.lng.toString(),
        destLat: mockCoords.to.lat.toString(),
        destLng: mockCoords.to.lng.toString(),
      };

      const response = await apiRequest('POST', '/api/routes/plan', routeRequestData);

      return response.json();
    },
    onSuccess: (data) => {
      setRouteInfo({
        distance: data.distance || '5.2 km',
        time: data.estimatedTime || '12 mins',
        safetyScore: data.safetyScore || 78
      });
      toast({
        title: 'Safe Route Found',
        description: 'Your route has been optimized to avoid high-risk areas.',
      });
    },
    onError: (error) => {
      console.error('Route planning error:', error);
      toast({
        title: 'Route Planning Error',
        description: 'Unable to plan route at this time. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handlePlanRoute = useCallback(() => {
    if (!origin.trim() || !destination.trim()) return;
    
    routePlanningMutation.mutate({
      fromLocation: origin.trim(),
      toLocation: destination.trim()
    });
  }, [origin, destination, routePlanningMutation]);

  const handleMapBoundsChange = useCallback((bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  }) => {
    console.log('Map bounds changed for route planning:', bounds); // TODO: remove mock functionality
  }, []);

  const handleCrimeClick = useCallback((crime: any) => {
    console.log('Crime marker clicked during navigation:', crime); // TODO: remove mock functionality
  }, []);

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Navigation className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-semibold">Safe Navigation</h1>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Planning Panel */}
        <div className="w-80 bg-card border-r border-border p-4 flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Plan Your Route</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">From</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter starting location"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="pl-10"
                    data-testid="input-origin"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">To</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="pl-10"
                    data-testid="input-destination"
                  />
                </div>
              </div>

              <Button
                onClick={handlePlanRoute}
                disabled={!origin.trim() || !destination.trim() || routePlanningMutation.isPending}
                className="w-full"
                data-testid="button-plan-route"
              >
                {routePlanningMutation.isPending ? 'Planning...' : 'Find Safer Route'}
              </Button>
            </CardContent>
          </Card>

          {routeInfo && (
            <Card data-testid="card-route-info">
              <CardHeader>
                <CardTitle className="text-base text-green-600">Route Found</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Distance:</span>
                  <span className="text-sm font-medium">{routeInfo.distance}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Est. Time:</span>
                  <span className="text-sm font-medium">{routeInfo.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Safety Score:</span>
                  <span className="text-sm font-medium text-green-600">{routeInfo.safetyScore}/100</span>
                </div>
                <div className="pt-2 text-xs text-muted-foreground">
                  This route avoids high-crime areas and prioritizes your safety.
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Map Area */}
        <div className="flex-1 relative">
          <MapContainer
            crimes={allCrimeData}
            onBoundsChange={handleMapBoundsChange}
            onCrimeClick={handleCrimeClick}
          />
        </div>
      </div>
    </div>
  );
}