'use client';

import { useState, useEffect, useRef, ChangeEvent, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';

interface SearchResult {
  id: string;
  title: string;
  slug: string;
  category: string;
  type: 'article' | 'category';
}

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  variant?: 'header' | 'standalone';
}

export default function SearchBar({
  className = '',
  placeholder = 'Search articles, topics, categories...',
  variant = 'header'
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/articles?search=${encodeURIComponent(query)}&limit=5`);
        const data = await response.json();
        
        const searchResults: SearchResult[] = data.articles.map((article: any) => ({
          id: article._id,
          title: article.title,
          slug: article.slug,
          category: article.category?.name || 'Uncategorized',
          type: 'article' as const
        }));
        
        setResults(searchResults);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(true);
    setSelectedIndex(-1);
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  const saveRecentSearch = (searchQuery: string) => {
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const handleSearch = (searchQuery?: string) => {
    const finalQuery = searchQuery || query;
    if (!finalQuery.trim()) return;

    saveRecentSearch(finalQuery);
    router.push(`/search?q=${encodeURIComponent(finalQuery)}`);
    setIsOpen(false);
    setQuery('');
  };

  const handleResultClick = (result: SearchResult) => {
    saveRecentSearch(result.title);
    router.push(`/articles/${result.slug}`);
    setIsOpen(false);
    setQuery('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    const totalItems = results.length + (recentSearches.length > 0 && query.trim().length < 2 ? recentSearches.length : 0);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < totalItems - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          if (query.trim().length < 2 && recentSearches.length > 0) {
            const selected = recentSearches[selectedIndex];
            setQuery(selected);
            handleSearch(selected);
          } else if (results.length > 0) {
            handleResultClick(results[selectedIndex]);
          }
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const showRecentSearches = query.trim().length < 2 && recentSearches.length > 0;
  const showResults = query.trim().length >= 2;

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={
            variant === 'header'
              ? 'w-full px-4 py-2 pl-10 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0A7FBF] focus:border-transparent'
              : 'w-full px-6 py-4 pl-12 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0A7FBF] focus:border-[#0A7FBF] text-lg'
          }
        />
        <svg
          className={
            variant === 'header'
              ? 'absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400'
              : 'absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400'
          }
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {isOpen && (showRecentSearches || showResults || isLoading) && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-2xl border border-gray-200 max-h-96 overflow-y-auto">
          {isLoading && (
            <div className="p-4 text-center text-gray-500">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-[#0A7FBF]"></div>
            </div>
          )}

          {showRecentSearches && !isLoading && (
            <div className="p-2">
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-xs font-semibold text-gray-500 uppercase">Recent Searches</span>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-[#0A7FBF] hover:text-[#0968A0] font-medium"
                >
                  Clear
                </button>
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setQuery(search);
                    handleSearch(search);
                  }}
                  className={`w-full px-3 py-2 text-left hover:bg-gray-50 rounded-md flex items-center gap-3 ${
                    selectedIndex === index ? 'bg-gray-100' : ''
                  }`}
                >
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-gray-700">{search}</span>
                </button>
              ))}
            </div>
          )}

          {showResults && !isLoading && (
            <div className="p-2">
              {results.length > 0 ? (
                <>
                  <div className="px-3 py-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase">Articles</span>
                  </div>
                  {results.map((result, index) => (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      className={`w-full px-3 py-3 text-left hover:bg-gray-50 rounded-md ${
                        selectedIndex === index ? 'bg-gray-100' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">{result.title}</div>
                          <div className="text-xs text-gray-500 mt-1">{result.category}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => handleSearch()}
                      className="w-full px-3 py-2 text-sm text-[#0A7FBF] hover:bg-gray-50 rounded-md text-center font-medium"
                    >
                      See all results for "{query}"
                    </button>
                  </div>
                </>
              ) : (
                <div className="px-3 py-8 text-center">
                  <svg className="mx-auto w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-gray-500">No results found for "{query}"</p>
                  <p className="text-xs text-gray-400 mt-1">Try different keywords</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
