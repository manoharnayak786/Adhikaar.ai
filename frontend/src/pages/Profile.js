import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { User, Mail, Calendar, LogOut } from 'lucide-react';

export default function Profile({ user, onLogout }) {
  if (!user) {
    return (
      <div className="min-h-screen py-12">
        <div className="mx-auto max-w-[600px] px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-muted-foreground">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-[600px] px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl font-bold mb-8">Profile</h1>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              {user.picture ? (
                <img
                  src={user.picture}
                  alt={user.name}
                  className="h-16 w-16 rounded-full"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
              )}
              <div>
                <CardTitle className="font-display text-2xl">{user.name}</CardTitle>
                <p className="text-sm text-muted-foreground">Member since {new Date(user.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-md bg-accent/20">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">{user.email}</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-md bg-accent/20">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">Joined {new Date(user.created_at).toLocaleDateString()}</span>
            </div>
            <div className="pt-4">
              <Button
                onClick={onLogout}
                variant="outline"
                className="w-full"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Log Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
