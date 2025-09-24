import { useState, useCallback, useMemo } from 'react';
import MapContainer from '@/components/MapContainer';
import SearchBar from '@/components/SearchBar';
import SafetyScoreCard from '@/components/SafetyScoreCard';
import FilterPanel from '@/components/FilterPanel';
import CrimeDetailsPopup from '@/components/CrimeDetailsPopup';
import { allCrimeData } from '@/data/mockCrimeData';
import { calculateSafetyScore, filterCrimesByDateRange, getCrimesInBounds } from '@/utils/safetyCalculations';
import { CrimeIncident, CrimeType, DateRange } from '@shared/schema';

export default function Home() {
  const [mapBounds, setMapBounds] = useState<{
    north: number;
    south: number;
    east: number;
    west: number;
  } | null>(null);
  const [selectedCrime, setSelectedCrime] = useState<CrimeIncident | null>(null);
  const [searchLocation, setSearchLocation] = useState<{ lat: number; lng: number } | undefined>();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<{
    crimeTypes: CrimeType[];
    dateRange: DateRange;
  }>({
    crimeTypes: ['Theft', 'Assault', 'Burglary', 'Vandalism', 'Robbery'],
    dateRange: 'All Time'
  });

  // Filter crimes based on current filters
  const filteredCrimes = useMemo(() => {
    let crimes = allCrimeData.filter(crime => 
      filters.crimeTypes.includes(crime.type as CrimeType)
    );
    
    crimes = filterCrimesByDateRange(crimes, filters.dateRange);
    
    return crimes;
  }, [filters]);

  // Get crimes visible in current map bounds
  const visibleCrimes = useMemo(() => {
    if (!mapBounds) return filteredCrimes;
    return getCrimesInBounds(filteredCrimes, mapBounds);
  }, [filteredCrimes, mapBounds]);

  // Calculate safety score for visible area
  const safetyScore = useMemo(() => {
    return calculateSafetyScore(visibleCrimes);
  }, [visibleCrimes]);

  const handleBoundsChange = useCallback((bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  }) => {
    setMapBounds(bounds);
  }, []);

  const handleCrimeClick = useCallback((crime: CrimeIncident) => {
    setSelectedCrime(crime);
  }, []);

  const handleSearch = useCallback((query: string) => {
    // TODO: remove mock functionality - implement real geocoding
    console.log('Searching for:', query);
    
    // Mock search results for demo - map common Lucknow locations
    const locations: Record<string, { lat: number; lng: number }> = {
      'hazratganj': { lat: 26.8467, lng: 80.9462 },
      'gomti nagar': { lat: 26.8950, lng: 81.0150 },
      'indira nagar': { lat: 26.8650, lng: 80.9750 },
      'aminabad': { lat: 26.8400, lng: 80.9200 },
      'alambagh': { lat: 26.8100, lng: 80.8850 },
      'chowk': { lat: 26.8520, lng: 80.9100 },
      'mahanagar': { lat: 26.8800, lng: 80.9900 },
      'aliganj': { lat: 26.9100, lng: 80.9600 },
      'nishatganj': { lat: 26.8350, lng: 80.9350 }
    };

    const searchKey = query.toLowerCase();
    const location = locations[searchKey] || 
      Object.entries(locations).find(([key]) => key.includes(searchKey))?.[1];

    if (location) {
      setSearchLocation(location);
    } else {
      // Default to center of Lucknow if no match
      setSearchLocation({ lat: 26.8467, lng: 80.9462 });
    }
  }, []);

  const handleFilterChange = useCallback((newFilters: {
    crimeTypes: CrimeType[];
    dateRange: DateRange;
  }) => {
    setFilters(newFilters);
  }, []);

  const toggleFilterPanel = useCallback(() => {
    setIsFilterOpen(prev => !prev);
  }, []);

  return (
    <div className="h-screen w-full relative overflow-hidden">
      {/* Search Bar - Fixed at top center */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-40">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Safety Score Card - Fixed at top left */}
      <div className="absolute top-4 left-4 z-40">
        <SafetyScoreCard 
          safetyScore={safetyScore}
          crimeCount={visibleCrimes.length}
        />
      </div>

      {/* Filter Panel - Fixed at top right */}
      <div className="absolute top-4 right-4 z-40">
        <FilterPanel
          onFilterChange={handleFilterChange}
          isOpen={isFilterOpen}
          onToggle={toggleFilterPanel}
        />
      </div>

      {/* Map Container - Full screen background */}
      <MapContainer
        crimes={filteredCrimes}
        onBoundsChange={handleBoundsChange}
        onCrimeClick={handleCrimeClick}
        searchLocation={searchLocation}
      />

      {/* Crime Details Popup */}
      <CrimeDetailsPopup
        crime={selectedCrime}
        isOpen={!!selectedCrime}
        onClose={() => setSelectedCrime(null)}
      />
    </div>
  );
}