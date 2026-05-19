import { mkdirSync, writeFileSync } from "fs";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const API_URL = process.env.VITE_API_URL || "http://localhost:3334";
const BASE_URL = process.env.SITE_URL || "https://orarimed.com";
const OUTPUT_DIR = resolve(__dirname, "../public");
const OUTPUT_FILE = resolve(OUTPUT_DIR, "sitemap.xml");

const staticUrls = [
  "/",
  "/specialities",
  "/actualities",
  "/contact",
  "/professionals",
  "/search",
];

const articleLocales = ["sq", "fr", "en"] as const;
const doctorLocales = ["sq", "fr", "en"] as const;

type ArticleLocale = (typeof articleLocales)[number];
type DoctorLocale = (typeof doctorLocales)[number];

type CenterItem = {
  centerIdentifier?: string;
  speciality?: { slug?: string };
};

function createUrlEntry(path: string) {
  const lastmod = new Date().toISOString().split("T")[0];
  return `  <url>\n    <loc>${BASE_URL}${path}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>`;
}

async function loadSpecialities() {
  try {
    const module = await import("../public/data/specialities.ts");
    return module.specialities ?? [];
  } catch (error) {
    console.warn(
      "⚠️ Impossible de charger les spécialités depuis public/data/specialities.ts. Le sitemap sera généré avec les pages statiques uniquement.",
    );
    return [];
  }
}

async function loadArticles(locale: ArticleLocale) {
  try {
    const res = await fetch(`${API_URL}/articles?locale=${locale}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch articles for locale ${locale}`);
    }

    const result = await res.json();
    return result.data ?? [];
  } catch (error) {
    console.warn(
      `⚠️ Impossible de charger les articles pour le locale ${locale}:`,
      error,
    );
    return [];
  }
}

async function loadDoctors() {
  const doctorUrls: string[] = [];

  try {
    const res = await fetch(`${API_URL}/doctor/list`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch doctors`);
    }

    const result = await res.json();
    const urls = result
      .map((doctor: any) =>
        doctor.doctorIdentifier && doctor.speciality?.slug
          ? `/doctor/${doctor.speciality.slug}/${doctor.doctorIdentifier}`
          : undefined,
      )
      .filter(Boolean) as string[];

    doctorUrls.push(...urls);
  } catch (error) {
    console.warn(`⚠️ Impossible de charger les médecins`, error);
  }

  return doctorUrls;
}

async function loadCenters() {
  const urls: string[] = [];

  try {
    const res = await fetch(`${API_URL}/allCenters`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();
    result.forEach((center: CenterItem) => {
      if (center.centerIdentifier && center.speciality?.slug) {
        const url = `/center/${center.speciality.slug}/${center.centerIdentifier}`;
      }
    });
  } catch {
    // ignore individual autocomplete failures
  }

  return urls;
}

async function main() {
  const specialities = await loadSpecialities();
  const specialityUrls = specialities
    .map((speciality: { slug: string }) => `/specialities/${speciality.slug}`)
    .filter(Boolean);

  const articleUrls = (
    await Promise.all(
      articleLocales.map(async (locale) => {
        const articles = await loadArticles(locale);
        return articles
          .map(
            (article: { slug?: string }) =>
              article.slug && `/actualities/${locale}/${article.slug}`,
          )
          .filter(Boolean) as string[];
      }),
    )
  ).flat();

  const doctorUrls = (await loadDoctors()).flat();
  const centerUrls = await loadCenters();

  const uniqueUrls = [
    ...new Set([
      ...staticUrls,
      ...specialityUrls,
      ...articleUrls,
      ...doctorUrls,
      ...centerUrls,
    ]),
  ];
  const urlset = uniqueUrls.map(createUrlEntry).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlset}\n</urlset>`;

  mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(OUTPUT_FILE, xml, "utf8");
  console.log(`✅ Sitemap généré dans ${OUTPUT_FILE}`);
}

main().catch((error) => {
  console.error("❌ Erreur lors de la génération du sitemap :", error);
  process.exit(1);
});
