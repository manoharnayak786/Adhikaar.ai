import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Search, Book, ExternalLink } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../components/ui/command';

const libraryItems = [
  {
    id: '1',
    title: 'Motor Vehicles Act, 1988',
    snippet: 'The Motor Vehicles Act regulates all aspects of road transport vehicles...',
    url: 'https://www.indiacode.nic.in/',
    type: 'Act',
    tags: ['traffic', 'transport'],
  },
  {
    id: '2',
    title: 'Consumer Protection Act, 2019',
    snippet: 'An Act to provide for protection of the interests of consumers...',
    url: 'https://consumeraffairs.nic.in/',
    type: 'Act',
    tags: ['consumer', 'rights'],
  },
  {
    id: '3',
    title: 'Code of Criminal Procedure, 1973',
    snippet: 'The Code of Criminal Procedure is the main legislation on procedure for administration of substantive criminal law in India...',
    url: 'https://www.indiacode.nic.in/',
    type: 'Act',
    tags: ['criminal', 'police'],
  },
];

export default function Library() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState(libraryItems);

  const handleSearch = (value) => {
    setSearchQuery(value);
    if (!value) {
      setResults(libraryItems);
      return;
    }
    const filtered = libraryItems.filter(
      (item) =>
        item.title.toLowerCase().includes(value.toLowerCase()) ||
        item.snippet.toLowerCase().includes(value.toLowerCase()) ||
        item.tags.some((tag) => tag.toLowerCase().includes(value.toLowerCase()))
    );
    setResults(filtered);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold flex items-center gap-3">
            <Book className="h-8 w-8 text-primary" />
            Rights Library
          </h1>
          <p className="mt-2 text-muted-foreground">
            Browse curated Indian laws, acts, and legal resources
          </p>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search acts, laws, and legal resources..."
                className="pl-10"
                data-testid="rights-search-input"
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {results.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
              </CardContent>
            </Card>
          ) : (
            results.map((item) => (
              <Card key={item.id} data-testid="rights-result-item">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="font-display text-lg mb-2">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary transition-colors inline-flex items-center gap-2"
                        >
                          {item.title}
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{item.snippet}</p>
                    </div>
                    <Badge variant="outline">{item.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
