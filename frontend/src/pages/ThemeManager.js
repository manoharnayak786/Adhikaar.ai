import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  Palette, Plus, Check, Copy, Edit, Trash2, Download, Upload, Undo2,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  duplicateTheme,
  deleteTheme,
  exportTheme,
  importTheme,
  restoreTheme,
  getDeletedThemes,
} from '../lib/themes';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';

export default function ThemeManager() {
  const navigate = useNavigate();
  const { themes, activeThemeId, switchTheme, refreshThemes } = useTheme();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [themeToDelete, setThemeToDelete] = useState(null);
  const [deletedThemeId, setDeletedThemeId] = useState(null);

  const handleSetActive = (themeId) => {
    switchTheme(themeId);
    toast.success('Theme activated', {
      className: 'bg-card border-success text-foreground',
    });
  };

  const handleDuplicate = (themeId) => {
    const newTheme = duplicateTheme(themeId);
    if (newTheme) {
      refreshThemes();
      toast.success(`Theme duplicated: ${newTheme.displayName}`, {
        className: 'bg-card border-success text-foreground',
      });
    }
  };

  const handleEdit = (themeId) => {
    navigate(`/themes/editor/${themeId}`);
  };

  const confirmDelete = (theme) => {
    setThemeToDelete(theme);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (themeToDelete) {
      deleteTheme(themeToDelete.id);
      setDeletedThemeId(themeToDelete.id);
      refreshThemes();
      setDeleteDialogOpen(false);
      
      toast.success('Theme deleted', {
        className: 'bg-card border-destructive text-foreground',
        description: 'You can undo this action',
        action: {
          label: 'Undo',
          onClick: () => handleRestore(themeToDelete.id),
        },
        duration: 10000,
      });
      
      setThemeToDelete(null);
    }
  };

  const handleRestore = (themeId) => {
    const restored = restoreTheme(themeId);
    if (restored) {
      refreshThemes();
      setDeletedThemeId(null);
      toast.success('Theme restored', {
        className: 'bg-card border-success text-foreground',
      });
    }
  };

  const handleExport = (themeId) => {
    exportTheme(themeId);
    toast.success('Theme exported', {
      className: 'bg-card border-success text-foreground',
    });
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const theme = await importTheme(file);
        refreshThemes();
        toast.success(`Theme imported: ${theme.displayName}`, {
          className: 'bg-card border-success text-foreground',
        });
      } catch (error) {
        toast.error('Failed to import theme', {
          className: 'bg-card border-destructive text-foreground',
          description: error.message,
        });
      }
    }
  };

  const isPreset = (themeId) => ['mint', 'success', 'indigo', 'warning'].includes(themeId);

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-4xl font-bold flex items-center gap-3">
              <Palette className="h-8 w-8 text-primary" />
              Theme Manager
            </h1>
            <p className="mt-2 text-muted-foreground">
              Customize your Adhikaar.ai experience with multi-color themes
            </p>
          </div>
          <div className="flex gap-2">
            <label htmlFor="import-theme">
              <Button variant="outline" asChild>
                <span className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </span>
              </Button>
              <input
                id="import-theme"
                type="file"
                accept=".json,.adhikaar-theme.json"
                className="hidden"
                onChange={handleImport}
              />
            </label>
            <Button onClick={() => navigate('/themes/editor/new')}>
              <Plus className="h-4 w-4 mr-2" />
              New Theme
            </Button>
          </div>
        </div>

        {/* Theme Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {themes.map((theme) => (
            <Card
              key={theme.id}
              className={`relative group hover:shadow-lg transition-shadow ${
                activeThemeId === theme.id ? 'ring-2 ring-primary' : ''
              }`}
              data-testid={`theme-card-${theme.id}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="font-display text-xl flex items-center gap-2">
                      {theme.displayName}
                      {activeThemeId === theme.id && (
                        <Badge variant="outline" className="text-xs">
                          <Check className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      )}
                      {isPreset(theme.id) && (
                        <Badge variant="secondary" className="text-xs">
                          Preset
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {theme.description || 'Custom theme'}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Color Swatches */}
                <div className="mb-4 flex gap-2">
                  <div
                    className="h-10 w-10 rounded-md border shadow-sm"
                    style={{ backgroundColor: theme.tokens['brand.primary'] }}
                    title="Primary"
                  />
                  <div
                    className="h-10 w-10 rounded-md border shadow-sm"
                    style={{ backgroundColor: theme.tokens['brand.secondary'] }}
                    title="Secondary"
                  />
                  <div
                    className="h-10 w-10 rounded-md border shadow-sm"
                    style={{ backgroundColor: theme.tokens['status.success'] }}
                    title="Success"
                  />
                  <div
                    className="h-10 w-10 rounded-md border shadow-sm"
                    style={{ backgroundColor: theme.tokens['status.warning'] }}
                    title="Warning"
                  />
                  <div
                    className="h-10 w-10 rounded-md border shadow-sm"
                    style={{ backgroundColor: theme.tokens['status.error'] }}
                    title="Error"
                  />
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  {activeThemeId !== theme.id && (
                    <Button
                      size="sm"
                      onClick={() => handleSetActive(theme.id)}
                      data-testid={`activate-theme-${theme.id}`}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Activate
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDuplicate(theme.id)}
                    data-testid={`duplicate-theme-${theme.id}`}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Duplicate
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(theme.id)}
                    data-testid={`edit-theme-${theme.id}`}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleExport(theme.id)}
                    data-testid={`export-theme-${theme.id}`}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                  {!isPreset(theme.id) && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => confirmDelete(theme)}
                      data-testid={`delete-theme-${theme.id}`}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Deleted Themes */}
        {getDeletedThemes().length > 0 && (
          <div className="mt-12">
            <h2 className="font-display text-2xl font-bold mb-4">Recently Deleted</h2>
            <div className="flex flex-wrap gap-4">
              {getDeletedThemes().map((theme) => (
                <Card key={theme.id} className="w-64">
                  <CardHeader>
                    <CardTitle className="text-base">{theme.displayName}</CardTitle>
                    <CardDescription className="text-xs">
                      Deleted {new Date(theme.deletedAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRestore(theme.id)}
                      className="w-full"
                    >
                      <Undo2 className="h-4 w-4 mr-1" />
                      Restore
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete theme?</AlertDialogTitle>
            <AlertDialogDescription>
              The theme "{themeToDelete?.displayName}" will be deleted. You can restore it from Recently
              Deleted within 30 days.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
