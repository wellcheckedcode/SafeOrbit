import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Navigation, RefreshCw } from 'lucide-react';
import { useLocation } from 'wouter';
import MapContainer from '@/components/MapContainer';
import SafetyScoreCard from '@/components/SafetyScoreCard';
import { allCrimeData } from '@/data/mockCrimeData';
import { calculateSafetyScore, getCrimesInBounds } from '@/utils/safetyCalculations';

export default function CurrentLocation() {
  const [, navigate] = useLocation();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [mapBounds, setMapBounds] = useState<{
    north: number;
    south: number;
    east: number;
    west: number;
  } | null>(null);

  const handleBack = () => {
    navigate('/');
  };

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
      return;
    }

    setIsLocating(true);
    setLocationError(null);
    console.log('Requesting user location...'); // TODO: remove mock functionality

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(location);
        setIsLocating(false);
        console.log('Location acquired:', location); // TODO: remove mock functionality
      },
      (error) => {
        console.error('Geolocation error:', error); // TODO: remove mock functionality
        let errorMessage = 'Unable to get your location.';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }
        
        setLocationError(errorMessage);
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  }, []);

  // Auto-request location on component mount
  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  const handleMapBoundsChange = useCallback((bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  }) => {
    setMapBounds(bounds);
  }, []);

  const handleCrimeClick = useCallback((crime: any) => {
    console.log('Crime marker clicked:', crime); // TODO: remove mock functionality
  }, []);

  // Calculate safety for visible area
  const visibleCrimes = mapBounds ? getCrimesInBounds(allCrimeData, mapBounds) : [];
  const safetyScore = calculateSafetyScore(visibleCrimes);

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
            <MapPin className="h-6 w-6 text-green-600" />
            <h1 className="text-xl font-semibold">Current Location</h1>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Status Panel */}
        <div className="w-80 bg-card border-r border-border p-4 flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Location Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLocating && (
                <div className="flex items-center gap-2 text-blue-600">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Getting your location...</span>
                </div>
              )}

              {locationError && (
                <div className="space-y-3">
                  <Badge variant="destructive" className="w-full justify-center">
                    Location Error
                  </Badge>
                  <p className="text-sm text-muted-foreground">{locationError}</p>
                  <Button
                    onClick={requestLocation}
                    variant="outline"
                    size="sm"
                    className="w-full"
                    data-testid="button-retry-location"
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                </div>
              )}

              {userLocation && (
                <div className="space-y-3">
                  <Badge variant="default" className="w-full justify-center bg-green-100 text-green-800">
                    Location Found
                  </Badge>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Latitude:</span>
                      <span className="font-medium" data-testid="text-user-lat">
                        {userLocation.lat.toFixed(6)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Longitude:</span>
                      <span className="font-medium" data-testid="text-user-lng">
                        {userLocation.lng.toFixed(6)}
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={requestLocation}
                    variant="outline"
                    size="sm"
                    className="w-full"
                    data-testid="button-refresh-location"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Location
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Safety Score for Current Area */}
          <SafetyScoreCard 
            safetyScore={safetyScore}
            crimeCount={visibleCrimes.length}
          />

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Nearby Risks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                {visibleCrimes.length === 0 ? (
                  'No recent incidents in this area'
                ) : (
                  `${visibleCrimes.length} incident${visibleCrimes.length === 1 ? '' : 's'} in visible area`
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative">
          <MapContainer
            crimes={allCrimeData}
            onBoundsChange={handleMapBoundsChange}
            onCrimeClick={handleCrimeClick}
            searchLocation={userLocation || undefined}
          />
          
          {userLocation && (
            <div className="absolute bottom-4 right-4 bg-card border border-border rounded-md p-2 shadow-lg">
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 bg-blue-600 rounded-full animate-pulse"></div>
                <span className="text-muted-foreground">Your Location</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}