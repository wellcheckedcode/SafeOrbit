import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export default function SearchBar({ onSearch, isLoading = false }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      console.log('Search triggered:', searchQuery.trim()); // TODO: remove mock functionality
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="relative flex items-center">
        <Input
          type="search"
          placeholder="Search for address or neighborhood..."
          value={searchQuery}
          onChange={handleInputChange}
          disabled={isLoading}
          className="pr-12"
          data-testid="input-search"
        />
        <Button
          type="submit"
          size="sm"
          disabled={isLoading || !searchQuery.trim()}
          className="absolute right-1 h-8"
          data-testid="button-search"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}