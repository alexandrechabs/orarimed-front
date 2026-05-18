import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export function useImage(id: string, imageName: string, kind: string) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (!imageName || !id) {
      setUrl("");
      return;
    }

    let imageUrl = "";
    if (kind === "article") {
      imageUrl = `${API_URL}/articles/${id}/image/${imageName}`;
    }

    setUrl(imageUrl);
  }, [id, imageName, kind]);

  return url;
}
