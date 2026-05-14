"use client";

import { useState, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Article, ArticleTranslation } from "@/types/article";
import { useToast } from "@/components/ui/use-toast";

interface AddArticleFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (article: Article) => Promise<void>;
  editingArticle?: Article | null;
}

export default function AddArticleForm({
  isOpen,
  onClose,
  onSubmit,
  editingArticle,
}: AddArticleFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedLocale, setSelectedLocale] = useState(1);

  const methods = useForm<Article>({
    defaultValues: editingArticle || {
      author: "",
      status: "draft",
      featured_image: "",
      translations: [
        { localeId: 1, title: "", slug: "", content: "", isPublished: false },
        { localeId: 2, title: "", slug: "", content: "", isPublished: false },
        { localeId: 3, title: "", slug: "", content: "", isPublished: false },
      ],
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = methods;
  const translations = watch("translations") || [];
  const currentTranslation = translations[selectedLocale - 1];

  // Reset form when editingArticle changes
  useEffect(() => {
    if (editingArticle) {
      reset({
        ...editingArticle,
        translations: editingArticle.translations || [
          {
            localeId: 1,
            title: "",
            slug: "",
            content: "",
            isPublished: false,
          },
          {
            localeId: 2,
            title: "",
            slug: "",
            content: "",
            isPublished: false,
          },
          {
            localeId: 3,
            title: "",
            slug: "",
            content: "",
            isPublished: false,
          },
        ],
      });
    } else {
      reset({
        status: "draft",
        translations: [
          {
            localeId: 1,
            title: "",
            slug: "",
            content: "",
            isPublished: false,
          },
          {
            localeId: 2,
            title: "",
            slug: "",
            content: "",
            isPublished: false,
          },
          {
            localeId: 3,
            title: "",
            slug: "",
            content: "",
            isPublished: false,
          },
        ],
      });
    }
  }, [editingArticle, reset]);

  const handleFormSubmit = async (data: Article) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
      reset();
      onClose();
      toast({
        title: "Succès",
        description: editingArticle ? "Article mis à jour" : "Article créé",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description:
          error instanceof Error ? error.message : "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTranslationChange = (
    field: keyof ArticleTranslation,
    value: any,
  ) => {
    const newTranslations = [...translations];
    if (!newTranslations[selectedLocale - 1]) {
      newTranslations[selectedLocale - 1] = {
        localeId: selectedLocale,
        title: "",
        slug: "",
        content: "",
        isPublished: false,
      };
    }
    newTranslations[selectedLocale - 1] = {
      ...newTranslations[selectedLocale - 1],
      [field]: value,
    };
    setValue("translations", newTranslations);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingArticle ? "Éditer l'article" : "Créer un nouvel article"}
          </DialogTitle>
          <DialogDescription>
            Remplissez les détails de l'article
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            {/* Infos générales */}
            <div className="space-y-3 border-b pb-4">
              <h3 className="font-semibold">Informations générales</h3>

              <div>
                <label className="text-sm font-medium">Auteur</label>
                <Input {...register("author")} placeholder="Nom de l'auteur" />
              </div>

              <div>
                <label className="text-sm font-medium">Statut</label>
                <Select
                  defaultValue={watch("status") || "draft"}
                  onValueChange={(value: any) => setValue("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="published">Publié</SelectItem>
                    <SelectItem value="archived">Archivé</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">
                  Image vedette (URL)
                </label>
                <Input
                  {...register("featured_image")}
                  placeholder="https://..."
                  type="url"
                />
              </div>
            </div>

            {/* Langues */}
            <div className="space-y-3 border-b pb-4">
              <h3 className="font-semibold">Contenu</h3>

              <div>
                <label className="text-sm font-medium">Langue</label>
                <Select
                  value={selectedLocale.toString()}
                  onValueChange={(value) => setSelectedLocale(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Français</SelectItem>
                    <SelectItem value="2">English</SelectItem>
                    <SelectItem value="3">Shqip</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {currentTranslation && (
                <>
                  <div>
                    <label className="text-sm font-medium">Titre *</label>
                    <Input
                      value={currentTranslation.title || ""}
                      onChange={(e) =>
                        handleTranslationChange("title", e.target.value)
                      }
                      placeholder="Titre de l'article"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Slug *</label>
                    <Input
                      value={currentTranslation.slug || ""}
                      onChange={(e) =>
                        handleTranslationChange("slug", e.target.value)
                      }
                      placeholder="titre-de-larticle"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Extrait</label>
                    <Input
                      value={currentTranslation.excerpt || ""}
                      onChange={(e) =>
                        handleTranslationChange("excerpt", e.target.value)
                      }
                      placeholder="Court résumé de l'article"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Contenu *</label>
                    <textarea
                      value={currentTranslation.content || ""}
                      onChange={(e) =>
                        handleTranslationChange("content", e.target.value)
                      }
                      placeholder="Contenu de l'article"
                      className="w-full h-32 p-2 border rounded-md text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Description SEO
                    </label>
                    <Input
                      value={currentTranslation.seo_description || ""}
                      onChange={(e) =>
                        handleTranslationChange(
                          "seo_description",
                          e.target.value,
                        )
                      }
                      placeholder="Description pour les moteurs de recherche"
                    />
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentTranslation.isPublished || false}
                      onChange={(e) =>
                        handleTranslationChange("isPublished", e.target.checked)
                      }
                      className="rounded"
                    />
                    <span className="text-sm">Publié dans cette langue</span>
                  </label>
                </>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onClose} type="button">
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "En cours..."
                  : editingArticle
                    ? "Mettre à jour"
                    : "Créer"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
