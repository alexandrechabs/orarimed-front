import type {
  ArticleCategory,
  ArticleCategoryTranslation,
} from "@/types/article";

const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = `${API_URL}/categories`;

export const categoryService = {
  async getCategories() {
    const token = localStorage.getItem("auth_token");
    if (!token) throw new Error("No authentication token found");

    const res = await fetch(BASE_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch categories");
    const result = await res.json();
    return result as ArticleCategory[];
  },

  async createCategory(category: {
    translations: ArticleCategoryTranslation[];
  }) {
    const token = localStorage.getItem("auth_token");
    if (!token) throw new Error("No authentication token found");

    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(category),
    });

    if (!res.ok) throw new Error("Failed to create category");
    const result = await res.json();
    return result as ArticleCategory;
  },

  async updateCategory(
    id: number,
    category: {
      translations: ArticleCategoryTranslation[];
    },
  ) {
    const token = localStorage.getItem("auth_token");
    if (!token) throw new Error("No authentication token found");

    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(category),
    });

    if (!res.ok) throw new Error("Failed to update category");
    const result = await res.json();
    return result as ArticleCategory;
  },

  async deleteCategory(id: number) {
    const token = localStorage.getItem("auth_token");
    if (!token) throw new Error("No authentication token found");

    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to delete category");
    return res.json();
  },
};
