import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { articleService } from "@/services/user/article.service";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Article } from "@/types/article";

const API_URL = import.meta.env.VITE_API_URL;

export default function ArticleDetail() {
  const { locale, slug } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const res = await articleService.getArticleBySlug(locale, slug);
        console.log(res);
        setArticle(res);
      } catch (err: any) {
        setError(err?.message || "Erreur lors du chargement de l'article");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  useEffect(() => {
    if (!article) return;

    document.title = article.seoTitle || article.title || "Article";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", article.seoDescription || "");
  }, [article]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-24 lg:pt-28">
          <div className="container mx-auto px-4 lg:px-8">Chargement...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-24 lg:pt-28">
          <div className="container mx-auto px-4 lg:px-8">Erreur: {error}</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-24 lg:pt-28">
        <section className="py-12 lg:py-20">
          <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
            {article.featuredImage && (
              <img
                src={`${API_URL}/articles/${article.id}/image/${article.featuredImage}`}
                alt={article.title || "Image article"}
                className="w-full rounded-lg mb-6 object-cover"
              />
            )}

            <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
            <p className="text-sm text-muted-foreground mb-6">
              {article?.author && <span>Par {article.author} · </span>}
              {article.publishedAt &&
                new Date(article.publishedAt).toLocaleDateString()}
            </p>

            <article
              className="max-w-none whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: article.content || "" }}
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
