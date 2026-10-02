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
import { Article, ArticleCategory } from "@/types/article";
import { useToast } from "@/components/ui/use-toast";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { useImage } from "@/hooks/use-image";
import { useLanguage } from "@/lib/i18n/LanguageContext";
interface AddArticleFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (article: Article) => Promise<void>;
  editingArticle?: Article | null;
  categories: ArticleCategory[];
}

export default function AddArticleForm({
  isOpen,
  onClose,
  onSubmit,
  editingArticle,
  categories,
}: AddArticleFormProps) {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateImage, setIsUpdatingImage] = useState(false);
  const [selectedLocale, setSelectedLocale] = useState(1);
  const [featuredImagePreview, setFeaturedImagePreview] = useState<
    string | null
  >(editingArticle?.featuredImage || null);
  const image = useImage(
    editingArticle?.id,
    editingArticle?.featuredImage,
    "article",
  );

  const methods = useForm<Article>({
    defaultValues: editingArticle || {
      author: "",
      status: "draft",
      categoryId: undefined,
      featuredImage: "",
      localeId: 1,
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      seoTitle: "",
      seoDescription: "",
      canonicalUrl: "",
      readingTime: undefined,
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
  // Reset form when editingArticle changes
  useEffect(() => {
    if (editingArticle) {
      setFeaturedImagePreview(editingArticle.featuredImage || null);
      setSelectedLocale(editingArticle.localeId || 1);
      reset({
        ...editingArticle,
        categoryId: editingArticle.categoryId || undefined,
        localeId: editingArticle.localeId || 1,
        title: editingArticle.title || "",
        slug: editingArticle.slug || "",
        excerpt: editingArticle.excerpt || "",
        content: editingArticle.content || "",
        seoTitle: editingArticle.seoTitle || "",
        seoDescription: editingArticle.seoDescription || "",
        canonicalUrl: editingArticle.canonicalUrl || "",
        readingTime: editingArticle.readingTime,
      });
    } else {
      setFeaturedImagePreview(null);
      setSelectedLocale(1);
      reset({
        status: "draft",
        categoryId: undefined,
        localeId: 1,
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        seoTitle: "",
        seoDescription: "",
        canonicalUrl: "",
        readingTime: undefined,
      });
    }
  }, [editingArticle, reset]);

  const handleFeaturedImageChange = (value: File | string | null) => {
    if (value instanceof File) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setFeaturedImagePreview(result);
        setValue("featuredImage", result);
      };
      reader.readAsDataURL(value);
    } else {
      setFeaturedImagePreview(value || null);
      setValue("featuredImage", value || "");
    }
  };

  const handleFormSubmit = async (data: Article) => {
    console.log("Submitting form with data:", data);
    try {
      setIsSubmitting(true);
      const payload: Article = {
        ...data,
        categoryId: data.categoryId ? Number(data.categoryId) : undefined,
        localeId: data.localeId ? Number(data.localeId) : undefined,
        readingTime: data.readingTime ? Number(data.readingTime) : undefined,
      };
      await onSubmit(payload);
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

  // handle field changes via react-hook-form `register` or `setValue`

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingArticle
              ? t.article.form.titleUpdate
              : t.article.form.titleCreate}
          </DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="space-y-4 mt-4"
          >
            {/* Infos générales */}
            <div className="space-y-3 border-b pb-4">
              <h3 className="font-semibold">
                {t.article.form.generalInformation}
              </h3>

              <div>
                <label className="text-sm font-medium">
                  {t.article.form.author}
                </label>
                <Input
                  {...register("author")}
                  placeholder={t.article.form.authorPlaceholder}
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  {t.article.form.category}
                </label>
                <Select
                  value={watch("categoryId")?.toString() || undefined}
                  onValueChange={(value: any) => setValue("categoryId", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.length > 0 ? (
                      categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                        >
                          {category.translations.find(
                            (t) => t.localeId === selectedLocale,
                          )?.name ||
                            category.translations[0]?.name ||
                            "-"}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="">Aucune catégorie</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">
                  {t.article.form.status}
                </label>
                <Select
                  value={watch("status") || "draft"}
                  onValueChange={(value: any) => setValue("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">
                      {t.article.form.statusDraft}
                    </SelectItem>
                    <SelectItem value="published">
                      {t.article.form.statusPublished}
                    </SelectItem>
                    <SelectItem value="archived">
                      {t.article.form.statusArchived}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium justify-between flex items-center mb-2">
                  {t.article.form.picture}
                  {editingArticle && editingArticle.featuredImage && (
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        setIsUpdatingImage(!updateImage);
                      }}
                    >
                      {updateImage ? t.common.cancel : t.picture.updateImage}
                    </Button>
                  )}
                </label>
                {editingArticle &&
                  editingArticle.featuredImage &&
                  !updateImage && (
                    // display image with 100 width
                    <img
                      src={image}
                      alt="Image"
                      className="w-[400px] h-auto rounded-md mx-auto mb-2"
                    />
                  )}
                {(!editingArticle ||
                  !editingArticle.featuredImage ||
                  updateImage) && (
                  <ImageUpload
                    value={featuredImagePreview || undefined}
                    onChange={handleFeaturedImageChange}
                    label=""
                    aspect={null}
                    maxWidth={2000}
                    maxHeight={2000}
                  />
                )}
              </div>
            </div>

            {/* Langues */}
            <div className="space-y-3 border-b pb-4">
              <h3 className="font-semibold">{t.article.form.content}</h3>

              <div>
                <label className="text-sm font-medium">
                  {t.article.form.language}
                </label>
                <Select
                  value={(watch("localeId") || selectedLocale).toString()}
                  onValueChange={(value) => {
                    console.log(value);

                    const n = parseInt(value);
                    setSelectedLocale(n);
                    setValue("localeId", n);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Shqip</SelectItem>
                    <SelectItem value="2">Français</SelectItem>
                    <SelectItem value="3">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">
                  {t.article.form.titleForm}
                </label>
                <Input
                  {...register("title")}
                  placeholder={t.article.form.titleFormPlaceholder}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  {t.article.form.Slug}
                </label>
                <Input
                  {...register("slug")}
                  placeholder={t.article.form.SlugPlaceholder}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  {t.article.form.extract}
                </label>
                <Input
                  {...register("excerpt")}
                  placeholder={t.article.form.extractPlaceholder}
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  {t.article.form.description}
                </label>
                <textarea
                  {...register("content")}
                  placeholder={t.article.form.descriptionPlaceholder}
                  className="w-full h-32 p-2 border rounded-md text-sm"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  {t.article.form.descriptionSEO}
                </label>
                <Input
                  {...register("seoDescription")}
                  placeholder={t.article.form.descriptionSEOPlaceholder}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onClose} type="button">
                {t.common.cancel}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? t.common.saving
                  : editingArticle
                    ? t.common.update
                    : t.common.create}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
