import { useEffect, useState } from 'react';
import { Speciality } from '@/types/specialty';

// En développement, on utilise un import dynamique
const specialitiesPromise = import.meta.env.PROD
  ? import('../../public/data/specialities')
  : (async () => {
      const response = await fetch('/data/specialities.ts');
      const text = await response.text();
      const match = text.match(
        /export const specialities = (\[[\s\S]*?\]) as const;/,
      );
      if (!match) throw new Error('Format de fichier invalide');
      return { specialities: eval(`(${match[1]})`) };
    })();

export function useSpecialities() {
  const [specialities, setSpecialities] = useState<Speciality[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadSpecialities = async () => {
      try {
        const { specialities } = await specialitiesPromise;
        setSpecialities(specialities);
      } catch (err) {
        console.error('Erreur de chargement des spécialités :', err);
        setError(err instanceof Error ? err : new Error('Erreur inconnue'));
      } finally {
        setIsLoading(false);
      }
    };

    loadSpecialities();
  }, []);

  return { specialities, isLoading, error };
}
