"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useImages } from "@/hooks/useImages";
import { Button } from "@/components/atoms/Button";

export function ImageNavButtons({ currentId }: { currentId: number }) {
  const router = useRouter();
  const { data, isLoading } = useImages();
  const images = data?.results ?? [];

  if (isLoading || images.length === 0) return null;

  const index = images.findIndex((img) => img.id === currentId);
  const prev = index > 0 ? images[index - 1] : null;
  const next = index < images.length - 1 ? images[index + 1] : null;

  return (
    <div className="flex items-center justify-center gap-3">
      <Button
        variant="outline"
        size="sm"
        disabled={!prev}
        onClick={() => prev && router.push(`/annotate/${prev.id}`)}
      >
        <ChevronLeft className="size-5" /> Previous
      </Button>
      <span className="text-xs text-muted-foreground">
        {index + 1} / {images.length}
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={!next}
        onClick={() => next && router.push(`/annotate/${next.id}`)}
      >
        Next <ChevronRight className="size-5" />
      </Button>
    </div>
  );
}
