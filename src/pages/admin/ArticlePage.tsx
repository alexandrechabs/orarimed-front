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
import { Pencil, Trash2, Plus, MoreVertical, Eye } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Article } from "@/types/article";
import { articleService } from "@/services/user/article.service";
import AddArticleForm from "@/components/admin/AddArticleForm";
import { Skeleton } from "@/components/ui/skeleton";

export default function ArticlePage() {
  const { toast } = useToast();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

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
        <div>
          {article.translations &&
            article.translations.length > 1 &&
            article.translations.map((translation) => (
              <span
                className={`inline-block mr-2 px-2 py-1 rounded text-xs font-medium ${translation.isPublished ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
              >
                {translation.locale.country}
              </span>
            ))}
        </div>
      </div>
    );
  };

  const getArticleTitle = (article: Article) => {
    return article.translations?.[0]?.title || "Sans titre";
  };

  const getArticleDate = (date: string | undefined) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("fr-FR");
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Articles</h1>
        <Button
          onClick={() => {
            setEditingArticle(null);
            setIsAddFormOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Créer un article
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Auteur</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Créé le</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5}>
                    <Skeleton className="h-8 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : articles.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  Aucun article pour le moment
                </TableCell>
              </TableRow>
            ) : (
              articles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell className="font-medium">
                    {getArticleTitle(article)}
                  </TableCell>
                  <TableCell>{article.author || "-"}</TableCell>
                  <TableCell>{getStatusBadge(article)}</TableCell>
                  <TableCell>{getArticleDate(article.created_at)}</TableCell>
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
                          Éditer
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setArticleToDelete(article);
                            setIsDeleteDialogOpen(true);
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Supprimer
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
      <AddArticleForm
        isOpen={isAddFormOpen}
        onClose={handleCloseForm}
        onSubmit={editingArticle ? handleUpdateArticle : handleAddArticle}
        editingArticle={editingArticle}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer l'article</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer «{" "}
              {articleToDelete && getArticleTitle(articleToDelete)} » ? Cette
              action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteArticle}
            className="bg-red-600"
          >
            Supprimer
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
