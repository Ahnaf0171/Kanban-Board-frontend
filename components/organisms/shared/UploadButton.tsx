"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { useImages } from "@/hooks/useImages";
import { Button } from "@/components/atoms/Button";
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE_MB } from "@/lib/config";

export function UploadButton() {
  const { upload } = useImages();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maxBytes = MAX_IMAGE_SIZE_MB * 1024 * 1024;
    const files = Array.from(e.target.files ?? []);
    const oversized = files.filter((f) => f.size > maxBytes);

    setError(
      oversized.length
        ? `${oversized.length} file(s) exceed ${MAX_IMAGE_SIZE_MB}MB and were skipped`
        : "",
    );
    files
      .filter((f) => f.size <= maxBytes)
      .forEach((file) => upload.mutate(file));
    e.target.value = "";
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ACCEPTED_IMAGE_TYPES.join(",")}
        hidden
        onChange={handleChange}
      />
      <Button
        size="lg"
        className="bg-sky-600 text-white hover:bg-sky-700 shadow-sm"
        onClick={() => inputRef.current?.click()}
        disabled={upload.isPending}
      >
        <Upload className="size-4" />
        Upload
      </Button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
