import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Navigation, MapPin } from 'lucide-react';
import { useLocation } from 'wouter';
import MapContainer from '@/components/MapContainer';
import { allCrimeData } from '@/data/mockCrimeData';

export default function Navigate() {
  const [, navigate] = useLocation();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [isPlanning, setIsPlanning] = useState(false);
  const [routeInfo, setRouteInfo] = useState<{ distance: string; time: string; safetyScore: number } | null>(null);

  const handleBack = () => {
    navigate('/');
  };

  const handlePlanRoute = useCallback(async () => {
    if (!origin.trim() || !destination.trim()) return;
    
    setIsPlanning(true);
    console.log('Planning safer route:', { origin, destination }); // TODO: remove mock functionality
    
    // TODO: remove mock functionality - implement real route planning with crime data
    setTimeout(() => {
      setRouteInfo({
        distance: '5.2 km',
        time: '12 mins',
        safetyScore: 78
      });
      setIsPlanning(false);
    }, 2000);
  }, [origin, destination]);

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
                disabled={!origin.trim() || !destination.trim() || isPlanning}
                className="w-full"
                data-testid="button-plan-route"
              >
                {isPlanning ? 'Planning...' : 'Find Safer Route'}
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