import SearchBar from '../SearchBar';

export default function SearchBarExample() {
  const handleSearch = (query: string) => {
    console.log('Search executed:', query); // TODO: remove mock functionality
  };

  return (
    <div className="p-4 bg-background">
      <SearchBar 
        onSearch={handleSearch} 
        isLoading={false}
      />
    </div>
  );
}