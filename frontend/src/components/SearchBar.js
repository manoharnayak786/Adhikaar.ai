import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

export const SearchBar = ({ onSearch, loading = false }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative" data-testid="ai-search-container">
      <div className="relative">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-12 rounded-md bg-card border border-border px-4 pr-28 text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="Ask: Can police check my phone during a traffic stop?"
          data-testid="ai-search-input"
          disabled={loading}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <Button
            type="submit"
            size="sm"
            className="bg-primary text-primary-foreground hover:opacity-90"
            data-testid="ai-search-submit-button"
            disabled={loading || !query.trim()}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
                Searching...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-1" />
                Ask
              </>
            )}
          </Button>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <span
          onClick={() => setQuery('Traffic challan dispute process')}
          className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:border-foreground hover:text-foreground cursor-pointer transition-all"
          data-testid="hint-chip-traffic"
        >
          Traffic challan
        </span>
        <span
          onClick={() => setQuery('Tenancy security deposit recovery')}
          className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:border-foreground hover:text-foreground cursor-pointer transition-all"
          data-testid="hint-chip-tenancy"
        >
          Tenancy deposit
        </span>
        <span
          onClick={() => setQuery('Consumer refund rights')}
          className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:border-foreground hover:text-foreground cursor-pointer transition-all"
          data-testid="hint-chip-consumer"
        >
          Consumer refund
        </span>
        <span
          onClick={() => setQuery('Police stop rights')}
          className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:border-foreground hover:text-foreground cursor-pointer transition-all"
          data-testid="hint-chip-police"
        >
          Police rights
        </span>
      </div>
    </form>
  );
};
