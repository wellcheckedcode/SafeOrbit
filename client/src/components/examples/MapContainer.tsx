import { useState } from 'react';
import MapContainer from '../MapContainer';
import { allCrimeData } from '@/data/mockCrimeData';
import { CrimeIncident } from '@shared/schema';

export default function MapContainerExample() {
  const [selectedCrime, setSelectedCrime] = useState<CrimeIncident | null>(null);

  const handleBoundsChange = (bounds: { north: number; south: number; east: number; west: number }) => {
    console.log('Map bounds changed:', bounds); // TODO: remove mock functionality
  };

  const handleCrimeClick = (crime: CrimeIncident) => {
    setSelectedCrime(crime);
    console.log('Crime clicked:', crime); // TODO: remove mock functionality
  };

  return (
    <div className="h-screen w-full">
      <MapContainer
        crimes={allCrimeData.slice(0, 50)} // Show first 50 crimes for demo
        onBoundsChange={handleBoundsChange}
        onCrimeClick={handleCrimeClick}
      />
    </div>
  );
}