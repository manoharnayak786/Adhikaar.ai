import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Phone, Shield, Users, Scale } from 'lucide-react';

const helplines = [
  {
    id: 'police',
    title: 'Emergency Police',
    number: '112',
    description: '24/7 Emergency Response',
    icon: Shield,
  },
  {
    id: 'women',
    title: 'Women Helpline',
    number: '181',
    description: 'Women Safety & Support',
    icon: Users,
  },
  {
    id: 'legal-aid',
    title: 'Legal Aid',
    number: '1516',
    description: 'Free Legal Assistance',
    icon: Scale,
  },
];

export const SOSPanel = () => {
  return (
    <Card className="rounded-lg border bg-card shadow-sm" data-testid="sos-panel">
      <CardHeader>
        <CardTitle className="font-display text-xl flex items-center gap-2">
          <Phone className="h-5 w-5 text-warning" />
          Emergency Helplines
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          24/7 verified helplines for immediate assistance
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {helplines.map(({ id, title, number, description, icon: Icon }) => (
          <button
            key={id}
            onClick={() => window.open(`tel:${number}`)}
            className="w-full flex items-center gap-4 p-4 rounded-md border border-border hover:border-warning hover:bg-accent/30 transition-all group"
            data-testid={`sos-${id}-button`}
          >
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-warning/10 flex items-center justify-center group-hover:bg-warning/20 transition-colors">
              <Icon className="h-5 w-5 text-warning" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-semibold text-foreground">{title}</div>
              <div className="text-xs text-muted-foreground">{description}</div>
            </div>
            <div className="text-2xl font-bold text-warning">{number}</div>
          </button>
        ))}
        <div className="mt-4 pt-4 border-t text-xs text-muted-foreground text-center">
          For non-emergency legal queries, use our AI search above
        </div>
      </CardContent>
    </Card>
  );
};
