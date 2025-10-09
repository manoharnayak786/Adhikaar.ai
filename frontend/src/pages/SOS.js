import React from 'react';
import { SOSPanel } from '../components/SOSPanel';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { AlertTriangle, Phone, MapPin } from 'lucide-react';

export default function SOS() {
  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-[900px] px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-warning/10 mb-4">
            <AlertTriangle className="h-8 w-8 text-warning" />
          </div>
          <h1 className="font-display text-4xl font-bold">Emergency Support</h1>
          <p className="mt-2 text-muted-foreground">
            24/7 helplines and emergency resources for immediate assistance
          </p>
        </div>

        <div className="space-y-6">
          <SOSPanel />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                State-Specific Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Select your state to view localized helplines and legal aid centers:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {['Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'West Bengal', 'Gujarat'].map(
                  (state) => (
                    <button
                      key={state}
                      className="p-3 rounded-md border border-border hover:border-primary hover:bg-accent/30 transition-all text-sm"
                    >
                      {state}
                    </button>
                  )
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Important Notes</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>
                • All helplines listed are official government or verified NGO resources
              </p>
              <p>
                • In case of immediate danger, always call 112 (Emergency Response)
              </p>
              <p>
                • For legal advice, these helplines can connect you with qualified advocates
              </p>
              <p>
                • Free legal aid is available to eligible citizens under the Legal Services Authorities Act
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
