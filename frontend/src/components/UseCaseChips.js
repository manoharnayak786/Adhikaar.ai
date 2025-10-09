import React from 'react';
import { Shield, Home, ShoppingCart, UserCheck, Briefcase } from 'lucide-react';
import { Badge } from './ui/badge';

const useCases = [
  { id: 'traffic', label: 'Traffic', icon: Shield },
  { id: 'tenancy', label: 'Tenancy', icon: Home },
  { id: 'consumer', label: 'Consumer', icon: ShoppingCart },
  { id: 'police', label: 'Police', icon: UserCheck },
  { id: 'employment', label: 'Employment', icon: Briefcase },
];

export const UseCaseChips = ({ selectedCase, onSelect }) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {useCases.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onSelect(id)}
          className={
            `inline-flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all hover:border-foreground hover:scale-105 ${
              selectedCase === id
                ? 'bg-accent border-ring ring-2 ring-ring text-accent-foreground'
                : 'border-border text-muted-foreground'
            }`
          }
          data-testid={`chip-${id}`}
        >
          <Icon className="h-4 w-4" />
          <span className="text-sm font-medium">{label}</span>
        </button>
      ))}
    </div>
  );
};
