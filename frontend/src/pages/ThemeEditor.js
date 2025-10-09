import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { ArrowLeft, Save, X, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
  getThemeById,
  saveCustomTheme,
  getContrastRatio,
  meetsWCAG,
} from '../lib/themes';
import { SearchBar } from '../components/SearchBar';
import { UseCaseChips } from '../components/UseCaseChips';
import { SOSPanel } from '../components/SOSPanel';

export default function ThemeEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { refreshThemes } = useTheme();
  
  const [themeName, setThemeName] = useState('');
  const [description, setDescription] = useState('');
  const [tokens, setTokens] = useState({});
  const [previewMode, setPreviewMode] = useState('components');

  useEffect(() => {
    if (id && id !== 'new') {
      const theme = getThemeById(id);
      if (theme) {
        setThemeName(theme.displayName);
        setDescription(theme.description || '');
        setTokens(theme.tokens);
      }
    } else {
      // New theme defaults
      setThemeName('New Theme');
      setDescription('');
      setTokens({
        'brand.primary': '#35E0B8',
        'brand.secondary': '#6CA8FF',
        'status.success': '#15C27E',
        'status.warning': '#FFB020',
        'status.error': '#E25555',
        'text.primary': '#E8EEF4',
        'text.muted': '#A7B4C2',
        'surface.background': '#0B0F14',
        'surface.card': '#0F141B',
        'surface.elevated': '#121923',
        'border.default': 'rgba(255,255,255,0.12)',
        'focus.ring': '0 0 0 3px rgba(53,224,184,0.35)',
      });
    }
  }, [id]);

  const handleTokenChange = (key, value) => {
    setTokens({ ...tokens, [key]: value });
  };

  const handleSave = () => {
    const themeId = id && id !== 'new' ? id : `custom_${Date.now()}`;
    
    const theme = {
      id: themeId,
      displayName: themeName,
      description,
      tokens,
      cssVariables: generateCSSVariables(tokens),
    };

    saveCustomTheme(theme);
    refreshThemes();
    
    toast.success('Theme saved successfully', {
      className: 'bg-card border-success text-foreground',
    });
    
    navigate('/themes');
  };

  const generateCSSVariables = (tokens) => {
    // Simplified CSS variable generation
    return {
      '--primary': rgbToHSL(tokens['brand.primary']),
      '--secondary': rgbToHSL(tokens['brand.secondary']),
      '--success': rgbToHSL(tokens['status.success']),
      '--warning': rgbToHSL(tokens['status.warning']),
      '--destructive': rgbToHSL(tokens['status.error']),
    };
  };

  const rgbToHSL = (hex) => {
    // Simple conversion - in production use a proper color library
    return '0 0% 50%'; // Placeholder
  };

  const ContrastChecker = ({ color1, color2, label }) => {
    const ratio = getContrastRatio(color1, color2);
    const meetsAA = meetsWCAG(ratio, 'AA');
    const meetsAAA = meetsWCAG(ratio, 'AAA');

    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">{label}:</span>
        <span className="font-mono">{ratio.toFixed(2)}:1</span>
        {meetsAAA ? (
          <Badge variant="outline" className="gap-1">
            <CheckCircle className="h-3 w-3 text-success" />
            AAA
          </Badge>
        ) : meetsAA ? (
          <Badge variant="outline" className="gap-1">
            <CheckCircle className="h-3 w-3 text-warning" />
            AA
          </Badge>
        ) : (
          <Badge variant="outline" className="gap-1">
            <XCircle className="h-3 w-3 text-destructive" />
            Fail
          </Badge>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/themes')}
              data-testid="back-to-themes"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="font-display text-3xl font-bold">Theme Editor</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Customize colors and preview changes in real-time
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/themes')}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave} data-testid="save-theme">
              <Save className="h-4 w-4 mr-2" />
              Save Theme
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Token Editor */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Theme Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-2">
                  <Label htmlFor="theme-name">Theme Name</Label>
                  <Input
                    id="theme-name"
                    value={themeName}
                    onChange={(e) => setThemeName(e.target.value)}
                    placeholder="My Custom Theme"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="theme-description">Description</Label>
                  <Input
                    id="theme-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="A beautiful custom theme"
                  />
                </div>

                <Separator />

                {/* Color Tokens */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">Brand Colors</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="brand-primary">Primary</Label>
                    <div className="flex gap-2">
                      <Input
                        id="brand-primary"
                        type="color"
                        value={tokens['brand.primary']}
                        onChange={(e) => handleTokenChange('brand.primary', e.target.value)}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={tokens['brand.primary']}
                        onChange={(e) => handleTokenChange('brand.primary', e.target.value)}
                        className="flex-1 font-mono text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="brand-secondary">Secondary</Label>
                    <div className="flex gap-2">
                      <Input
                        id="brand-secondary"
                        type="color"
                        value={tokens['brand.secondary']}
                        onChange={(e) => handleTokenChange('brand.secondary', e.target.value)}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={tokens['brand.secondary']}
                        onChange={(e) => handleTokenChange('brand.secondary', e.target.value)}
                        className="flex-1 font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">Status Colors</h3>
                  
                  {['success', 'warning', 'error'].map((status) => (
                    <div key={status} className="space-y-2">
                      <Label htmlFor={`status-${status}`} className="capitalize">{status}</Label>
                      <div className="flex gap-2">
                        <Input
                          id={`status-${status}`}
                          type="color"
                          value={tokens[`status.${status}`]}
                          onChange={(e) => handleTokenChange(`status.${status}`, e.target.value)}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          value={tokens[`status.${status}`]}
                          onChange={(e) => handleTokenChange(`status.${status}`, e.target.value)}
                          className="flex-1 font-mono text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Contrast Checker */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    Accessibility
                  </h3>
                  <ContrastChecker
                    color1={tokens['text.primary']}
                    color2={tokens['surface.background']}
                    label="Text/Background"
                  />
                  <ContrastChecker
                    color1={tokens['brand.primary']}
                    color2={tokens['surface.background']}
                    label="Primary/Background"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Pane */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Live Preview</CardTitle>
                  <Tabs value={previewMode} onValueChange={setPreviewMode}>
                    <TabsList>
                      <TabsTrigger value="components">Components</TabsTrigger>
                      <TabsTrigger value="page">Full Page</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6 p-6 rounded-lg border" style={{
                  backgroundColor: tokens['surface.background'],
                  color: tokens['text.primary'],
                }}>
                  {previewMode === 'components' ? (
                    <>
                      {/* Button Previews */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold" style={{ color: tokens['text.muted'] }}>
                          Buttons
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          <button
                            className="px-4 py-2 rounded-md font-medium"
                            style={{ backgroundColor: tokens['brand.primary'], color: '#fff' }}
                          >
                            Primary Button
                          </button>
                          <button
                            className="px-4 py-2 rounded-md font-medium"
                            style={{ backgroundColor: tokens['brand.secondary'], color: '#fff' }}
                          >
                            Secondary Button
                          </button>
                          <button
                            className="px-4 py-2 rounded-md font-medium border"
                            style={{ borderColor: tokens['border.default'], color: tokens['text.primary'] }}
                          >
                            Outline Button
                          </button>
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold" style={{ color: tokens['text.muted'] }}>
                          Badges
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          <span
                            className="px-2 py-1 rounded text-xs font-medium"
                            style={{ backgroundColor: tokens['status.success'], color: '#fff' }}
                          >
                            Success
                          </span>
                          <span
                            className="px-2 py-1 rounded text-xs font-medium"
                            style={{ backgroundColor: tokens['status.warning'], color: '#fff' }}
                          >
                            Warning
                          </span>
                          <span
                            className="px-2 py-1 rounded text-xs font-medium"
                            style={{ backgroundColor: tokens['status.error'], color: '#fff' }}
                          >
                            Error
                          </span>
                        </div>
                      </div>

                      {/* Card Preview */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold" style={{ color: tokens['text.muted'] }}>
                          Card
                        </h4>
                        <div
                          className="p-4 rounded-lg border"
                          style={{
                            backgroundColor: tokens['surface.card'],
                            borderColor: tokens['border.default'],
                          }}
                        >
                          <h5 className="font-semibold mb-2" style={{ color: tokens['text.primary'] }}>
                            Card Title
                          </h5>
                          <p style={{ color: tokens['text.muted'] }}>
                            This is a preview of how cards will look with your theme.
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-6">
                      <UseCaseChips selectedCase="traffic" onSelect={() => {}} />
                      <SearchBar onSearch={() => {}} />
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <SOSPanel />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
