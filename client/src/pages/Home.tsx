import { useState, useCallback, useMemo, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import MapContainer from "@/components/MapContainer";
import SearchBar from "@/components/SearchBar";
import SafetyScoreCard from "@/components/SafetyScoreCard";
import FilterPanel from "@/components/FilterPanel";
import CrimeDetailsPopup from "@/components/CrimeDetailsPopup";
import { calculateSafetyScore, filterCrimesByDateRange, getCrimesInBounds } from "@/utils/safetyCalculations";
import { CrimeIncident, CrimeType, DateRange } from "@shared/schema";
import { AuthContext } from "@/App";
import { UserProfile } from "@shared/schema";
import { User as UserIcon } from "lucide-react";
import { useState as useStateReact } from "react";
import LoginModal from "@/components/LoginModal";
import ProfileModal from "@/components/ProfileModal";
import { apiRequest } from "@/lib/queryClient";

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
    crimeTypes: ["Theft", "Assault", "Burglary", "Vandalism", "Robbery"],
    dateRange: "All Time",
  });

  // Fetch crimes from API
  const { data: crimes = [], isLoading: crimesLoading } = useQuery<CrimeIncident[]>({
    queryKey: ['crimes'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/crimes');
      return response.json();
    },
  });

  // Auth context
  const { user, setUser } = useContext(AuthContext);

  // Modal states
  const [isLoginOpen, setIsLoginOpen] = useStateReact(false);
  const [isProfileOpen, setIsProfileOpen] = useStateReact(false);

  // Filter crimes based on current filters
  const filteredCrimes = useMemo(() => {
    let filtered = crimes.filter((crime) => filters.crimeTypes.includes(crime.type as CrimeType));

    filtered = filterCrimesByDateRange(filtered, filters.dateRange);

    return filtered;
  }, [crimes, filters]);

  // Get crimes visible in current map bounds
  const visibleCrimes = useMemo(() => {
    if (!mapBounds) return filteredCrimes;
    return getCrimesInBounds(filteredCrimes, mapBounds);
  }, [filteredCrimes, mapBounds]);

  // Calculate safety score for visible area
  const safetyScore = useMemo(() => {
    return calculateSafetyScore(visibleCrimes);
  }, [visibleCrimes]);

  const handleBoundsChange = useCallback(
    (bounds: {
      north: number;
      south: number;
      east: number;
      west: number;
    }) => {
      setMapBounds(bounds);
    },
    []
  );

  const handleCrimeClick = useCallback((crime: CrimeIncident) => {
    setSelectedCrime(crime);
  }, []);

  const handleSearch = useCallback((query: string) => {
    // TODO: remove mock functionality - implement real geocoding
    console.log("Searching for:", query);

    // Mock search results for demo - map common Lucknow locations
    const locations: Record<string, { lat: number; lng: number }> = {
      hazratganj: { lat: 26.8467, lng: 80.9462 },
      "gomti nagar": { lat: 26.895, lng: 81.015 },
      "indira nagar": { lat: 26.865, lng: 80.975 },
      aminabad: { lat: 26.84, lng: 80.92 },
      alambagh: { lat: 26.81, lng: 80.885 },
      chowk: { lat: 26.852, lng: 80.91 },
      mahanagar: { lat: 26.88, lng: 80.99 },
      aliganj: { lat: 26.91, lng: 80.96 },
      nishatganj: { lat: 26.835, lng: 80.935 },
    };

    const searchKey = query.toLowerCase();
    const location =
      locations[searchKey] || Object.entries(locations).find(([key]) => key.includes(searchKey))?.[1];

    if (location) {
      setSearchLocation(location);
    } else {
      // Default to center of Lucknow if no match
      setSearchLocation({ lat: 26.8467, lng: 80.9462 });
    }
  }, []);

  const handleFilterChange = useCallback(
    (newFilters: {
      crimeTypes: CrimeType[];
      dateRange: DateRange;
    }) => {
      setFilters(newFilters);
    },
    []
  );

  const toggleFilterPanel = useCallback(() => {
    setIsFilterOpen((prev) => !prev);
  }, []);

  // Profile icon click handler
  const handleProfileIconClick = () => {
    if (user) {
      // If logged in, open profile modal
      setIsProfileOpen(true);
    } else {
      // If not logged in, open login modal
      setIsLoginOpen(true);
    }
  };

  return (
    <div className="h-screen w-full relative overflow-hidden">
      {/* Search Bar - Fixed at top center */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-40">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Safety Score Card - Fixed at top left */}
      <div className="absolute top-4 left-4 z-40">
        <SafetyScoreCard safetyScore={safetyScore} crimeCount={visibleCrimes.length} />
      </div>

      {/* Filter Panel - Fixed at top right */}
      <div className="absolute top-4 right-4 z-40">
        <FilterPanel onFilterChange={handleFilterChange} isOpen={isFilterOpen} onToggle={toggleFilterPanel} />
      </div>

      {/* Profile Icon - Fixed at top right corner, left of filter panel */}
      <div className="absolute top-4 right-20 z-50 cursor-pointer" onClick={handleProfileIconClick} title={user ? `Logged in as ${user.name}` : "Login / Create Profile"}>
        <UserIcon className="h-8 w-8 text-blue-600" />
        {user && <span className="ml-2 font-semibold text-blue-600">{user.name}</span>}
      </div>

      {/* Map Container - Full screen background */}
      <MapContainer
        crimes={filteredCrimes}
        onBoundsChange={handleBoundsChange}
        onCrimeClick={handleCrimeClick}
        searchLocation={searchLocation}
      />

      {/* Crime Details Popup */}
      <CrimeDetailsPopup crime={selectedCrime} isOpen={!!selectedCrime} onClose={() => setSelectedCrime(null)} />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToProfileCreate={() => {
          setIsLoginOpen(false);
          setIsProfileOpen(true);
        }}
      />

      {/* Profile Modal */}
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </div>
  );
}
