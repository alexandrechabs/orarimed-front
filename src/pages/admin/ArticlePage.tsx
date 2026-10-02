"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Pencil, Trash2, Plus, MoreVertical } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Article, ArticleCategory } from "@/types/article";
import { articleService } from "@/services/user/article.service";
import { categoryService } from "@/services/user/category.service";
import AddArticleForm from "@/components/admin/AddArticleForm";
import ArticleCategoryManager from "@/components/admin/ArticleCategoryManager";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function ArticlePage() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<ArticleCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const loadArticles = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await articleService.getArticles();
      setArticles(data);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les articles",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const loadCategories = useCallback(async () => {
    try {
      setIsCategoriesLoading(true);
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les catégories",
        variant: "destructive",
      });
    } finally {
      setIsCategoriesLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadCategories();
    loadArticles();
  }, [loadArticles, loadCategories]);

  const handleAddArticle = async (article: Article) => {
    try {
      await articleService.createArticle(article);
      await loadArticles();
      setIsAddFormOpen(false);
    } catch (error) {
      throw error;
    }
  };

  const handleUpdateArticle = async (article: Article) => {
    try {
      if (!editingArticle?.id) throw new Error("Article ID not found");
      await articleService.updateArticle(editingArticle.id, article);
      await loadArticles();
      setEditingArticle(null);
      setIsAddFormOpen(false);
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteArticle = async () => {
    try {
      if (!articleToDelete?.id) throw new Error("Article ID not found");
      await articleService.deleteArticle(articleToDelete.id);
      await loadArticles();
      setArticleToDelete(null);
      setIsDeleteDialogOpen(false);
      toast({
        title: "Succès",
        description: "Article supprimé avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'article",
        variant: "destructive",
      });
    }
  };

  const handleEditClick = (article: Article) => {
    setEditingArticle(article);
    setIsAddFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsAddFormOpen(false);
    setEditingArticle(null);
  };

  const getStatusBadge = (article: Article) => {
    const statusConfig: Record<string, { label: string; color: string }> = {
      draft: { label: "Brouillon", color: "bg-yellow-100 text-yellow-800" },
      published: { label: "Publié", color: "bg-green-100 text-green-800" },
      archived: { label: "Archivé", color: "bg-gray-100 text-gray-800" },
    };

    const config = statusConfig[article.status] || statusConfig.draft;
    return (
      <div className="space-y-2">
        <div>
          <span
            className={`inline-block px-2 py-1 rounded text-xs font-medium ${config.color}`}
          >
            {config.label}
          </span>
        </div>
      </div>
    );
  };

  const getArticleDate = (date: string | undefined) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("fr-FR");
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex flex-wrap gap-3 justify-between items-center">
        <h1 className="text-3xl font-bold">Articles</h1>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => {
              setEditingArticle(null);
              setIsAddFormOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            {t.article.addButton}
          </Button>
          {categories && (
            <ArticleCategoryManager
              categories={categories}
              onCategoriesUpdated={setCategories}
            />
          )}
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.article.table.title}</TableHead>
              <TableHead>{t.article.table.category}</TableHead>
              <TableHead>{t.article.table.author}</TableHead>
              <TableHead>{t.article.table.status}</TableHead>
              <TableHead>{t.article.table.createdAt}</TableHead>
              <TableHead className="text-right">
                {t.article.table.actions}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={6}>
                    <Skeleton className="h-8 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : articles.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  {t.article.table.noArticles}
                </TableCell>
              </TableRow>
            ) : (
              articles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell className="font-medium">{article.title}</TableCell>
                  <TableCell>
                    {article.category?.translations[0].name || "-"}
                  </TableCell>
                  <TableCell>{article.author || "-"}</TableCell>
                  <TableCell>{getStatusBadge(article)}</TableCell>
                  <TableCell>{getArticleDate(article.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleEditClick(article)}
                        >
                          <Pencil className="w-4 h-4 mr-2" />
                          {t.common.modify}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setArticleToDelete(article);
                            setIsDeleteDialogOpen(true);
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          {t.common.delete}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Form Modal */}
      {categories && (
        <AddArticleForm
          isOpen={isAddFormOpen}
          onClose={handleCloseForm}
          onSubmit={editingArticle ? handleUpdateArticle : handleAddArticle}
          editingArticle={editingArticle}
          categories={categories}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.article.delete.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.article.delete.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogCancel>{t.common.cancel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteArticle}
            className="bg-red-600"
          >
            {t.common.delete}
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
