import { useState } from 'react';
import CrimeDetailsPopup from '../CrimeDetailsPopup';
import { Button } from '@/components/ui/button';
import { CrimeIncident } from '@shared/schema';

export default function CrimeDetailsPopupExample() {
  const [isOpen, setIsOpen] = useState(false);

  const sampleCrime: CrimeIncident = {
    id: '1',
    lat: '26.8500',
    lng: '80.9500',
    type: 'Theft',
    severity: 6,
    date: '2024-08-15',
    description: 'A purse was snatched near Hazratganj market during busy afternoon hours. The victim was walking alone when approached by two individuals on a motorcycle.'
  };

  return (
    <div className="p-4 bg-background">
      <Button onClick={() => setIsOpen(true)} data-testid="button-open-popup">
        View Crime Details
      </Button>
      <CrimeDetailsPopup
        crime={sampleCrime}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
}