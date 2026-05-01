import { useJsApiLoader } from '@react-google-maps/api';
import { useMemo, useRef } from 'react';

interface GoogleMapsLoaderOptions {
  googleMapsApiKey: string;
  libraries?: ('places')[];
  language?: string;
}

// Global state pour éviter les rechargements multiples
const globalLoaderState = {
  isLoaded: false,
  loadError: null as any,
  currentLanguage: null as string | null,
  isLoading: false,
};

export function useGoogleMapsLoader(options: GoogleMapsLoaderOptions) {
  const languageRef = useRef(options.language);
  
  // Si le script est déjà chargé avec une autre langue, on retourne l'état actuel
  // sans essayer de recharger (ce qui cause l'erreur)
  const shouldSkipReload = globalLoaderState.isLoaded && 
                           globalLoaderState.currentLanguage !== options.language;

  const memoizedOptions = useMemo(() => {
    if (shouldSkipReload) {
      // Garder les options originales pour éviter le rechargement
      return {
        googleMapsApiKey: options.googleMapsApiKey,
        libraries: options.libraries,
        language: globalLoaderState.currentLanguage || 'en',
      };
    }
    return options;
  }, [shouldSkipReload, options]);

  const { isLoaded, loadError } = useJsApiLoader(memoizedOptions);

  // Mettre à jour l'état global
  if (isLoaded && !globalLoaderState.isLoaded) {
    globalLoaderState.isLoaded = true;
    globalLoaderState.loadError = null;
    globalLoaderState.currentLanguage = options.language || 'en';
  }

  return { 
    isLoaded: globalLoaderState.isLoaded || isLoaded, 
    loadError: globalLoaderState.loadError || loadError 
  };
}
