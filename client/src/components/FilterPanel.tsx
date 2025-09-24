import { useState, useEffect } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { crimeTypes, dateRanges, CrimeType, DateRange } from '@shared/schema';

interface FilterPanelProps {
  onFilterChange: (filters: {
    crimeTypes: CrimeType[];
    dateRange: DateRange;
  }) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function FilterPanel({ onFilterChange, isOpen, onToggle }: FilterPanelProps) {
  const [selectedCrimeTypes, setSelectedCrimeTypes] = useState<CrimeType[]>([...crimeTypes]);
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange>('All Time');

  // Notify parent of filter changes
  useEffect(() => {
    onFilterChange({
      crimeTypes: selectedCrimeTypes,
      dateRange: selectedDateRange
    });
    console.log('Filters updated:', { selectedCrimeTypes, selectedDateRange }); // TODO: remove mock functionality
  }, [selectedCrimeTypes, selectedDateRange, onFilterChange]);

  const handleCrimeTypeToggle = (crimeType: CrimeType) => {
    setSelectedCrimeTypes(prev => {
      if (prev.includes(crimeType)) {
        return prev.filter(type => type !== crimeType);
      } else {
        return [...prev, crimeType];
      }
    });
  };

  const resetFilters = () => {
    setSelectedCrimeTypes([...crimeTypes]);
    setSelectedDateRange('All Time');
    console.log('Filters reset'); // TODO: remove mock functionality
  };

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        variant="outline"
        size="sm"
        className="fixed top-4 right-4 z-50 md:relative md:top-0 md:right-0"
        data-testid="button-open-filters"
      >
        <Filter className="h-4 w-4 mr-2" />
        Filters
      </Button>
    );
  }

  return (
    <Card className="fixed top-4 right-4 z-50 w-80 md:relative md:top-0 md:right-0 md:w-full" data-testid="card-filter-panel">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            data-testid="button-close-filters"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Crime Types Filter */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Crime Types</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-auto p-0 text-xs"
              data-testid="button-reset-filters"
            >
              Reset All
            </Button>
          </div>
          <div className="space-y-2">
            {crimeTypes.map(crimeType => (
              <div key={crimeType} className="flex items-center space-x-2">
                <Checkbox
                  id={`crime-${crimeType}`}
                  checked={selectedCrimeTypes.includes(crimeType)}
                  onCheckedChange={() => handleCrimeTypeToggle(crimeType)}
                  data-testid={`checkbox-crime-${crimeType.toLowerCase()}`}
                />
                <label
                  htmlFor={`crime-${crimeType}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {crimeType}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Time Period</h3>
          <Select
            value={selectedDateRange}
            onValueChange={(value: DateRange) => setSelectedDateRange(value)}
          >
            <SelectTrigger data-testid="select-date-range">
              <SelectValue placeholder="Select time period" />
            </SelectTrigger>
            <SelectContent>
              {dateRanges.map(range => (
                <SelectItem key={range} value={range} data-testid={`option-${range.toLowerCase().replace(/ /g, '-')}`}>
                  {range}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters Summary */}
        <div className="pt-2 border-t">
          <div className="text-xs text-muted-foreground">
            Showing {selectedCrimeTypes.length} of {crimeTypes.length} crime types
          </div>
          <div className="text-xs text-muted-foreground">
            Time period: {selectedDateRange}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}