"use client";

import { useState } from "react";
import { useImage } from "@/hooks/useImages";
import { useAnnotations } from "@/hooks/useAnnotations";
import { useAnnotationUIStore } from "@/store/annotationUIStore";
import { ConfirmDialog } from "@/components/molecules/ConfirmDialog";
import { Button } from "@/components/atoms/Button";
import { EmptyState } from "@/components/organisms/EmptyState";
import { cn } from "@/lib/utils";

export function AnnotationList({ imageId }: { imageId: number }) {
  const { data: image } = useImage(imageId);
  const { remove } = useAnnotations(imageId);
  const { selectedAnnotationId, selectAnnotation } = useAnnotationUIStore();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const annotations = image?.annotations ?? [];
  if (annotations.length === 0)
    return <EmptyState message="No annotations yet" />;

  return (
    <>
      <ul className="space-y-1">
        {annotations.map((a) => (
          <li
            key={a.id}
            onClick={() => selectAnnotation(a.id)}
            className={cn(
              "flex items-center justify-between rounded-md px-2 py-1.5 text-sm cursor-pointer",
              selectedAnnotationId === a.id
                ? "bg-primary/10"
                : "hover:bg-muted",
            )}
          >
            <span className="flex items-center gap-2">
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: a.color }}
              />
              {a.label}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setDeleteId(a.id);
              }}
              className="rounded-md bg-red-700 text-white hover:bg-red-800"
            >
              Remove
            </Button>
          </li>
        ))}
      </ul>

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={() => setDeleteId(null)}
        title="Delete annotation?"
        variant="destructive"
        isLoading={remove.isPending}
        onConfirm={() =>
          deleteId &&
          remove.mutate(deleteId, { onSuccess: () => setDeleteId(null) })
        }
      />
    </>
  );
}
