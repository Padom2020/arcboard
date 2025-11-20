'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SearchResult } from '@/app/api/search/route';

interface SearchBarProps {
  className?: string;
}

export function SearchBar({ className = '' }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{
    dapps: SearchResult[];
    tutorials: SearchResult[];
  }>({ dapps: [], tutorials: [] });
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Debounce search
  useEffect(() => {
    if (!query.trim()) {
      setResults({ dapps: [], tutorials: [] });
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (response.ok) {
          const data = await response.json();
          setResults(data.results);
          setIsOpen(true);
          setSelectedIndex(-1);
        }
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get all results as flat array for keyboard navigation
  const allResults = [...results.dapps, ...results.tutorials];
  const totalResults = allResults.length;

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen || totalResults === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => (prev < totalResults - 1 ? prev + 1 : prev));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < totalResults) {
            handleResultClick(allResults[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          inputRef.current?.blur();
          break;
      }
    },
    [isOpen, totalResults, selectedIndex, allResults]
  );

  const handleResultClick = (result: SearchResult) => {
    router.push(result.url);
    setQuery('');
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const clearSearch = () => {
    setQuery('');
    setResults({ dapps: [], tutorials: [] });
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim() && setIsOpen(true)}
          placeholder="Search DApps and tutorials..."
          className="h-10 w-full rounded-md border border-input bg-background pl-10 pr-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
        {!isLoading && query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && totalResults > 0 && (
        <div className="absolute top-full z-50 mt-2 w-full rounded-md border border-border bg-popover shadow-lg">
          <div className="max-h-[400px] overflow-y-auto p-2">
            {/* DApps Section */}
            {results.dapps.length > 0 && (
              <div className="mb-2">
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                  DApps
                </div>
                {results.dapps.map((result, index) => {
                  const globalIndex = index;
                  return (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      className={`w-full rounded-md px-3 py-2 text-left transition-colors ${
                        selectedIndex === globalIndex
                          ? 'bg-accent text-accent-foreground'
                          : 'hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      <div className="font-medium">{result.title}</div>
                      <div className="line-clamp-1 text-sm text-muted-foreground">
                        {result.description}
                      </div>
                      {result.category && (
                        <div className="mt-1 text-xs text-muted-foreground">
                          {result.category}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Tutorials Section */}
            {results.tutorials.length > 0 && (
              <div>
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                  Tutorials
                </div>
                {results.tutorials.map((result, index) => {
                  const globalIndex = results.dapps.length + index;
                  return (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      className={`w-full rounded-md px-3 py-2 text-left transition-colors ${
                        selectedIndex === globalIndex
                          ? 'bg-accent text-accent-foreground'
                          : 'hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      <div className="font-medium">{result.title}</div>
                      <div className="line-clamp-1 text-sm text-muted-foreground">
                        {result.description}
                      </div>
                      {result.category && (
                        <div className="mt-1 text-xs capitalize text-muted-foreground">
                          {result.category}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* No Results */}
      {isOpen && !isLoading && query.trim() && totalResults === 0 && (
        <div className="absolute top-full z-50 mt-2 w-full rounded-md border border-border bg-popover p-4 text-center text-sm text-muted-foreground shadow-lg">
          No results found for &quot;{query}&quot;
        </div>
      )}
    </div>
  );
}
