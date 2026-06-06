import { useCallback, useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { X, Loader2, Upload, Check } from "lucide-react";
import ReactCrop, {
  Crop,
  PixelCrop,
  centerCrop,
  makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "./button";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface ImageUploadProps {
  value?: string;
  onChange: (value: File | string | null) => void;
  disabled?: boolean;
  label?: string;
  aspect?: number | null;
  className?: string;
  maxWidth?: number; // Maximum image width in pixels
  maxHeight?: number; // Maximum image height in pixels
}

export const ImageUpload = ({
  value,
  onChange,
  disabled = false,
  label = "",
  aspect = 1,
  className = "",
  maxWidth = 4000,
  maxHeight = 4000,
}: ImageUploadProps) => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [imgSrc, setImgSrc] = useState("");
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  if ((label = "")) {
    label = t.picture.download;
  }
  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement> | File[]) => {
    const files = Array.isArray(e) ? e : e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      // getfile width and height
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        // Vérifier les dimensions de l'image
        if (img.width > maxWidth || img.height > maxHeight) {
          setError(
            t.picture.resolutionError
              .replace("{max}", maxWidth + "x" + maxHeight)
              .replace("{current}", img.width + "x" + img.height),
          );
          return;
        }
        setError(null);
        if (aspect === null) {
          setCrop(getFreeCrop());
        } else if (aspect) {
          setCrop(centerAspectCrop(img.width, img.height, aspect));
        } else {
          setCrop(undefined);
        }
      };
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgSrc(reader.result?.toString() || "");
        setPreview(reader.result?.toString() || null);
      });
      reader.readAsDataURL(file);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    onSelectFile(acceptedFiles);
  }, []);

  const onDropAccepted = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      // Vérifier la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError(t.picture.sizeError);
        return;
      }

      // Vérifier le type de fichier
      if (!file.type.startsWith("image/")) {
        setError(t.picture.typeError);
        return;
      }

      setError(null);
      setIsLoading(true);

      // Simuler un téléchargement
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
        // Ici, vous devrez implémenter la logique de téléchargement réel
        // Par exemple, uploader sur Cloudinary, S3, etc.
        // Pour l'instant, on simule un délai
        setTimeout(() => {
          setIsLoading(false);
          onChange(URL.createObjectURL(file)); // Utilisez l'URL de téléchargement réelle ici
        }, 1000);
      };
      reader.readAsDataURL(file);
    },
    [onChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
    },
    maxFiles: 1,
    disabled: disabled || isLoading,
  });

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    setImgSrc("");
    setCrop(undefined);
    setCompletedCrop(undefined);
    if (onChange) {
      onChange(null);
    }
  };

  function centerAspectCrop(
    mediaWidth: number,
    mediaHeight: number,
    aspect: number,
  ) {
    return centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 90,
        },
        aspect,
        mediaWidth,
        mediaHeight,
      ),
      mediaWidth,
      mediaHeight,
    );
  }

  function getFreeCrop(): Crop {
    return {
      unit: "%" as const,
      width: 90,
      height: 90,
      x: 5,
      y: 5,
    };
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (aspect === null) {
      setCrop(getFreeCrop());
    } else if (aspect && typeof aspect === "number") {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    } else {
      setCrop(undefined);
    }
  }

  function onCropChange(c: Crop) {
    setCrop(c);
  }

  function dataURLtoFile(dataurl: string, filename: string): File {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  // Modifiez la fonction onCropComplete pour générer l'aperçu
  const onCropComplete = (crop: PixelCrop) => {
    setCompletedCrop(crop); // Mettez à jour le crop complété

    if (!imgRef.current) return;

    const canvas = document.createElement("canvas");
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
    const pixelRatio = window.devicePixelRatio || 1;

    canvas.width = crop.width * pixelRatio * scaleX;
    canvas.height = crop.height * pixelRatio * scaleY;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      imgRef.current,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY,
    );

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], "cropped-image.jpg", {
          type: "image/jpeg",
        });

        // Mettre à jour l'aperçu
        const reader = new FileReader();
        reader.onload = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(blob);

        // Mettre à jour la valeur
        onChange(file);
      },
      "image/jpeg",
      1,
    );
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div
        {...getRootProps()}
        className={`relative group border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50"
        } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        <input {...getInputProps()} />

        {imgSrc ? (
          <div onClick={(e) => e.stopPropagation()} className="relative">
            {crop && (
              <div className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center p-4">
                <div className="bg-background p-4 rounded-lg max-w-2xl w-full">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">
                      {t.stats.resizePicture}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setCrop(undefined)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="relative">
                    <ReactCrop
                      crop={crop}
                      onChange={onCropChange}
                      onComplete={onCropComplete}
                      aspect={aspect || undefined}
                      className="max-h-[70vh]"
                    >
                      <img
                        ref={imgRef}
                        src={imgSrc}
                        onLoad={onImageLoad}
                        alt="Crop preview"
                        style={{ maxHeight: "70vh", maxWidth: "100%" }}
                      />
                    </ReactCrop>
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setCrop(undefined)}
                      className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                    >
                      {t.common.cancel}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();

                        if (!completedCrop && imgRef.current) {
                          const img = imgRef.current;
                          if (aspect === null) {
                            onCropComplete(getFreeCrop() as PixelCrop);
                          } else if (aspect && typeof aspect === "number") {
                            const defaultCrop = centerAspectCrop(
                              img.naturalWidth,
                              img.naturalHeight,
                              aspect,
                            );

                            const pixelCrop: PixelCrop = {
                              ...defaultCrop,
                              height: 426.546875,
                              width: 427,
                              x: 111.5,
                              y: 0,
                              unit: "px" as const,
                            };

                            onCropComplete(pixelCrop);
                          }
                        } else if (completedCrop) {
                          onCropComplete(completedCrop);
                        }
                        setCrop(undefined);
                      }}
                      className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 flex items-center"
                    >
                      <Check className="mr-2 h-4 w-4" />
                      {t.common.validate}
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className="relative">
              <div onClick={(e) => e.stopPropagation()}>
                <img
                  src={preview || imgSrc}
                  alt="Preview"
                  className="mx-auto max-h-64 w-auto rounded-lg object-cover"
                  style={{ aspectRatio: aspect ? aspect : undefined }}
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const img = new Image();
                    img.onload = () => {
                      if (aspect === null) {
                        setCrop(getFreeCrop());
                      } else if (aspect && typeof aspect === "number") {
                        setCrop(
                          centerAspectCrop(img.width, img.height, aspect),
                        );
                      }
                    };
                    img.src = preview || imgSrc;
                  }}
                  className="bg-background text-foreground p-2 rounded-full hover:bg-background/90 transition-colors"
                  disabled={isLoading}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5" />
                    <path d="m16 2 4 4L10.5 16.5 7 18l1.5-3.5L16 2Z" />
                  </svg>
                </button>
              </div>
            </div>
            {!disabled && (
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-3 -right-3 bg-destructive text-destructive-foreground p-1.5 rounded-full shadow-md hover:bg-destructive/90 transition-colors"
                disabled={isLoading}
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <canvas
              ref={previewCanvasRef}
              style={{
                display: "none",
              }}
            />
          </div>
        ) : (
          <div className="space-y-2">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              {isLoading ? (
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              ) : (
                <Upload className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {isLoading ? t.common.loading : label}
              </p>
              <p className="text-xs text-muted-foreground">
                {isDragActive ? t.picture.put : t.picture.dragAndDrop}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.picture.formatAndSize
                  .replace("{volume}", "5MB")
                  .replace("size", maxWidth + "x" + maxHeight)}
              </p>
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};

export default ImageUpload;
