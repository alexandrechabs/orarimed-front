export type ArticleTranslation = {
  id?: string;
  articleId?: string;
  localeId: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  readingTime?: number;
  isPublished: boolean;
  article?: Article;
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
  categoryId?: string;
  featuredImage?: string;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  translations?: ArticleTranslation[];
};
