import { Article, ArticleTranslation } from "@/types/article";

const API_URL = import.meta.env.VITE_API_URL;

export const articleService = {
  async getArticles() {
    const token = localStorage.getItem("auth_token");
    if (!token) throw new Error("No authentication token found");

    const res = await fetch(`${API_URL}/articles`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch articles");
    const result = await res.json();
    return result.data as Article[];
  },

  async getArticle(id: string) {
    const token = localStorage.getItem("auth_token");
    if (!token) throw new Error("No authentication token found");

    const res = await fetch(`${API_URL}/articles/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch article");
    return res.json() as Promise<Article>;
  },

  async createArticle(article: Article) {
    const token = localStorage.getItem("auth_token");
    if (!token) throw new Error("No authentication token found");

    const res = await fetch(`${API_URL}/articles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(article),
    });

    if (!res.ok) throw new Error("Failed to create article");
    return res.json() as Promise<Article>;
  },

  async updateArticle(id: string, article: Article) {
    const token = localStorage.getItem("auth_token");
    if (!token) throw new Error("No authentication token found");

    const res = await fetch(`${API_URL}/articles/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(article),
    });

    if (!res.ok) throw new Error("Failed to update article");
    return res.json() as Promise<Article>;
  },

  async deleteArticle(id: string) {
    const token = localStorage.getItem("auth_token");
    if (!token) throw new Error("No authentication token found");

    const res = await fetch(`${API_URL}/articles/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to delete article");
    return res.json();
  },
};
