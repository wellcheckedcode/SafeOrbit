import { useState } from 'react';
import FilterPanel from '../FilterPanel';
import { CrimeType, DateRange } from '@shared/schema';

export default function FilterPanelExample() {
  const [isOpen, setIsOpen] = useState(true);

  const handleFilterChange = (filters: {
    crimeTypes: CrimeType[];
    dateRange: DateRange;
  }) => {
    console.log('Filters changed:', filters); // TODO: remove mock functionality
  };

  const handleToggle = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <div className="p-4 bg-background">
      <FilterPanel
        onFilterChange={handleFilterChange}
        isOpen={isOpen}
        onToggle={handleToggle}
      />
    </div>
  );
}