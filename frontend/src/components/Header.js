import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { ShieldCheck, Sun, LogOut, User, Palette } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useTheme } from '../contexts/ThemeContext';

export const Header = ({ user, onLogin, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { themes, activeThemeId, switchTheme } = useTheme();

  return (
    <header
      className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      data-testid="global-header"
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            data-testid="header-logo-button"
          >
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-primary/80 to-secondary/70 text-primary-foreground shadow">
              <Logo className="h-6 w-6" />
            </div>
            <span className="font-display text-lg font-semibold">Adhikaar.ai</span>
          </Link>
          <span
            className="hidden sm:inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs text-muted-foreground transition-transform hover:scale-105"
            data-testid="secure-badge"
          >
            <ShieldCheck className="h-3 w-3 text-success" />
            Secure
          </span>
          <span
            className="hidden sm:inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs text-muted-foreground transition-transform hover:scale-105"
            data-testid="availability-badge"
          >
            <Sun className="h-3 w-3 text-secondary" />
            24/7
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Theme Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:flex items-center gap-2"
                data-testid="header-theme-button"
              >
                <Palette className="h-4 w-4" />
                <span className="hidden lg:inline">Theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Switch Theme</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {themes.slice(0, 4).map((theme) => (
                <DropdownMenuItem
                  key={theme.id}
                  onClick={() => switchTheme(theme.id)}
                  className={activeThemeId === theme.id ? 'bg-accent' : ''}
                  data-testid={`theme-option-${theme.id}`}
                >
                  <div className="flex items-center gap-2 w-full">
                    <div
                      className="h-4 w-4 rounded-sm border"
                      style={{ backgroundColor: theme.tokens['brand.primary'] }}
                    />
                    <span className="flex-1">{theme.displayName}</span>
                    {activeThemeId === theme.id && <ShieldCheck className="h-3 w-3" />}
                  </div>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/themes')}>
                <Palette className="h-4 w-4 mr-2" />
                Manage Themes
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {user ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/profile')}
                className="hidden md:flex items-center gap-2"
                data-testid="header-profile-button"
              >
                <User className="h-4 w-4" />
                {user.name}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="hidden md:flex items-center gap-2"
                data-testid="header-logout-button"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogin}
                className="hidden md:flex"
                data-testid="header-login-button"
              >
                Log in
              </Button>
              <Button
                size="sm"
                onClick={onLogin}
                className="bg-primary text-primary-foreground hover:opacity-90"
                data-testid="header-start-button"
              >
                Start free
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
