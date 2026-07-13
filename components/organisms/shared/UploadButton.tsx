"use client";

import { useRef } from "react";
import { Upload } from "lucide-react";
import { useImages } from "@/hooks/useImages";
import { Button } from "@/components/atoms/Button";
import { ACCEPTED_IMAGE_TYPES } from "@/lib/config";

export function UploadButton() {
  const { upload } = useImages();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    Array.from(e.target.files ?? []).forEach((file) => upload.mutate(file));
    e.target.value = "";
  };

  return (
    <>
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
    </>
  );
}
