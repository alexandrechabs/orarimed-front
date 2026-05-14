export type ArticleTranslation = {
  id?: string;
  articleId?: string;
  localeId: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  seo_title?: string;
  seo_description?: string;
  canonical_url?: string;
  reading_time?: number;
  isPublished: boolean;
  locale?: {
    id: number;
    code: string;
    country: string;
  };
};

export type Article = {
  id?: string;
  author?: string;
  status: "draft" | "published" | "archived";
  category_id?: string;
  featured_image?: string;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
  translations?: ArticleTranslation[];
};
