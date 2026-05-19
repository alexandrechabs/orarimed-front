"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Trash2, Pencil } from "lucide-react";
import { ArticleCategory } from "@/types/article";
import { categoryService } from "@/services/user/category.service";

const LOCALES = [
  { id: 1, label: "Shqip" },
  { id: 2, label: "Français" },
  { id: 3, label: "English" },
];

interface ArticleCategoryManagerProps {
  categories: ArticleCategory[];
  onCategoriesUpdated: (categories: ArticleCategory[]) => void;
}

export default function ArticleCategoryManager({
  categories,
  onCategoriesUpdated,
}: ArticleCategoryManagerProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [translations, setTranslations] = useState<Record<number, string>>({
    1: "",
    2: "",
    3: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [deletingCategoryId, setDeletingCategoryId] = useState<number | null>(
    null,
  );
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(
    null,
  );
  const [editTranslations, setEditTranslations] = useState<
    Record<number, string>
  >({
    1: "",
    2: "",
    3: "",
  });

  const handleInputChange = (localeId: number, value: string) => {
    setTranslations((current) => ({ ...current, [localeId]: value }));
  };

  const handleCreateCategory = async () => {
    const missingTranslation = LOCALES.some(
      (locale) => !translations[locale.id]?.trim(),
    );

    if (missingTranslation) {
      toast({
        title: "Erreur",
        description: "Veuillez renseigner tous les libellés de catégorie",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);
      const payload = {
        translations: LOCALES.map((locale) => ({
          localeId: locale.id,
          name: translations[locale.id].trim(),
        })),
      };
      const result = await categoryService.createCategory(payload);
      onCategoriesUpdated([...categories, result]);
      setTranslations({ 1: "", 2: "", 3: "" });
      toast({ title: "Succès", description: "Catégorie créée" });
    } catch (error) {
      toast({
        title: "Erreur",
        description:
          error instanceof Error
            ? error.message
            : "Impossible de créer la catégorie",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleStartEdit = (category: ArticleCategory) => {
    setEditingCategoryId(category.id);
    const editTrans: Record<number, string> = { 1: "", 2: "", 3: "" };
    category.translations.forEach((translation) => {
      editTrans[translation.localeId] = translation.name;
    });
    setEditTranslations(editTrans);
  };

  const handleEditInputChange = (localeId: number, value: string) => {
    setEditTranslations((current) => ({ ...current, [localeId]: value }));
  };

  const handleUpdateCategory = async () => {
    const missingTranslation = LOCALES.some(
      (locale) => !editTranslations[locale.id]?.trim(),
    );

    if (missingTranslation) {
      toast({
        title: "Erreur",
        description: "Veuillez renseigner tous les libellés de catégorie",
        variant: "destructive",
      });
      return;
    }

    if (!editingCategoryId) return;

    try {
      setIsSaving(true);
      const payload = {
        translations: LOCALES.map((locale) => ({
          localeId: locale.id,
          name: editTranslations[locale.id].trim(),
        })),
      };
      const result = await categoryService.updateCategory(
        editingCategoryId,
        payload,
      );
      const updatedCategories = categories.map((cat) =>
        cat.id === editingCategoryId ? result : cat,
      );
      onCategoriesUpdated(updatedCategories);
      setEditingCategoryId(null);
      setEditTranslations({ 1: "", 2: "", 3: "" });
      toast({ title: "Succès", description: "Catégorie mise à jour" });
    } catch (error) {
      toast({
        title: "Erreur",
        description:
          error instanceof Error
            ? error.message
            : "Impossible de mettre à jour la catégorie",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingCategoryId(null);
    setEditTranslations({ 1: "", 2: "", 3: "" });
  };

  const handleDeleteCategory = async (categoryId: number) => {
    try {
      setDeletingCategoryId(categoryId);
      await categoryService.deleteCategory(categoryId);
      onCategoriesUpdated(
        categories.filter((category) => category.id !== categoryId),
      );
      toast({ title: "Succès", description: "Catégorie supprimée" });
    } catch (error) {
      toast({
        title: "Erreur",
        description:
          error instanceof Error
            ? error.message
            : "Impossible de supprimer la catégorie",
        variant: "destructive",
      });
    } finally {
      setDeletingCategoryId(null);
    }
  };

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Gérer les catégories
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Gérer les catégories</DialogTitle>
            <DialogDescription>
              Créez et supprimez les catégories d’article en plusieurs langues.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-3 border-b pb-4">
              <h3 className="font-semibold">Nouvelle catégorie</h3>
              <div className="grid gap-3 sm:grid-cols-3">
                {LOCALES.map((locale) => (
                  <div key={locale.id}>
                    <label className="text-sm font-medium">
                      {locale.label}
                    </label>
                    <Input
                      value={translations[locale.id]}
                      onChange={(event) =>
                        handleInputChange(locale.id, event.target.value)
                      }
                      placeholder={`Libellé en ${locale.label}`}
                    />
                  </div>
                ))}
              </div>
              <Button
                onClick={handleCreateCategory}
                disabled={isSaving}
                type="button"
              >
                {isSaving ? "Création..." : "Créer la catégorie"}
              </Button>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Catégories existantes</h3>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Shqip</TableHead>
                      <TableHead>Français</TableHead>
                      <TableHead>English</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6">
                          Aucune catégorie disponible
                        </TableCell>
                      </TableRow>
                    ) : (
                      categories.map((category) => (
                        <TableRow key={category.id}>
                          <TableCell>{category.id}</TableCell>
                          {LOCALES.map((locale) => {
                            const translation = category.translations.find(
                              (translation) =>
                                translation.localeId === locale.id,
                            );
                            return (
                              <TableCell key={locale.id}>
                                {translation?.name || "-"}
                              </TableCell>
                            );
                          })}
                          <TableCell className="text-right space-x-2">
                            <Button
                              variant="outline"
                              className="text-blue-600"
                              onClick={() => handleStartEdit(category)}
                              disabled={isSaving || editingCategoryId !== null}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              className="text-red-600"
                              onClick={() => handleDeleteCategory(category.id)}
                              disabled={
                                deletingCategoryId === category.id ||
                                editingCategoryId !== null
                              }
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {editingCategoryId && (
              <div className="space-y-3 border-t pt-4 bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold">Modifier la catégorie</h3>
                <div className="grid gap-3 sm:grid-cols-3">
                  {LOCALES.map((locale) => (
                    <div key={locale.id}>
                      <label className="text-sm font-medium">
                        {locale.label}
                      </label>
                      <Input
                        value={editTranslations[locale.id]}
                        onChange={(event) =>
                          handleEditInputChange(locale.id, event.target.value)
                        }
                        placeholder={`Libellé en ${locale.label}`}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleUpdateCategory}
                    disabled={isSaving}
                    type="button"
                  >
                    {isSaving ? "Mise à jour..." : "Mettre à jour"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancelEdit}
                    disabled={isSaving}
                    type="button"
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
