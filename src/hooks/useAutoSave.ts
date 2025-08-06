
import { useState, useEffect, useCallback } from 'react';

interface UseAutoSaveOptions {
  key: string;
  data: any;
  debounceMs?: number;
}

export const useAutoSave = ({ key, data, debounceMs = 1000 }: UseAutoSaveOptions) => {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const saveToStorage = useCallback((dataToSave: any) => {
    try {
      setIsSaving(true);
      localStorage.setItem(key, JSON.stringify({
        data: dataToSave,
        timestamp: new Date().toISOString()
      }));
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    } finally {
      setIsSaving(false);
    }
  }, [key]);

  const loadFromStorage = useCallback(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          data: parsed.data,
          timestamp: new Date(parsed.timestamp)
        };
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
    }
    return null;
  }, [key]);

  const clearSaved = useCallback(() => {
    try {
      localStorage.removeItem(key);
      setLastSaved(null);
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }, [key]);

  // Debounced auto-save
  useEffect(() => {
    if (!data) return;

    const timeoutId = setTimeout(() => {
      saveToStorage(data);
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [data, saveToStorage, debounceMs]);

  return {
    lastSaved,
    isSaving,
    loadFromStorage,
    clearSaved,
    saveToStorage
  };
};
