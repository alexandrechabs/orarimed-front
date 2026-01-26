import { writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const API_URL = process.env.API_URL || 'http://localhost:3334'; // Remplacez par l'URL de votre API
const OUTPUT_DIR = resolve(__dirname, '../public/data');
const OUTPUT_FILE = resolve(OUTPUT_DIR, 'specialities.ts');

async function fetchSpecialities() {
  try {
    console.log("📡 Récupération des spécialités depuis l'API...");

    console.log(`${API_URL}/specialities`);

    const response = await fetch(`${API_URL}/specialities`); // Ajustez l'endpoint selon votre API
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const specialities = await response.json();

    // Créer le répertoire s'il n'existe pas
    mkdirSync(OUTPUT_DIR, { recursive: true });

    // Générer le contenu du fichier TypeScript
    const fileContent = `// Ce fichier est généré automatiquement - NE PAS MODIFIER MANUELLEMENT
// Généré le: ${new Date().toISOString()}

export const specialities = ${JSON.stringify(specialities, null, 2)} as const;

export type Speciality = {
  id: number;
  slug: string;
  icon: string;
  color: string;
  position: number;
  translations: Array<{
    id: number;
    locale: string;
    name: string;
  }>;
  subSpecialities: Array<{
    id: number;
    slug: string;
    position: number;
    translations: Array<{
      id: number;
      locale: string;
      name: string;
    }>;
  }>;
};`;

    // Écrire le fichier
    writeFileSync(OUTPUT_FILE, fileContent, 'utf8');
    console.log(`✅ Fichier généré avec succès : ${OUTPUT_FILE}`);
  } catch (error) {
    console.error('❌ Erreur lors de la génération des spécialités :', error);
    process.exit(1);
  }
}

fetchSpecialities();
