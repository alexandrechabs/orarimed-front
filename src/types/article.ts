export type ArticleCategoryTranslation = {
  localeId: number;
  name: string;
};

export type ArticleCategory = {
  id: number;
  translations: ArticleCategoryTranslation[];
};

export type Article = {
  id?: string;
  author?: string;
  status: "draft" | "published" | "archived";
  categoryId?: number;
  featuredImage?: string;
  // Single-language fields (DB now stores article fields directly)
  localeId?: number;
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  readingTime?: number;

  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  category?: ArticleCategory;
};

export type ArticleTranslation = Article;
