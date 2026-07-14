"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Trash2 } from "lucide-react";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  horizontalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useImages } from "@/hooks/useImages";
import { EmptyState } from "@/components/organisms/shared/EmptyState";
import { Spinner } from "@/components/atoms/Spinner";
import { ConfirmDialog } from "@/components/molecules/ConfirmDialog";
import { cn } from "@/lib/utils";
import type { ImageAsset } from "@/types/annotation";

function Thumb({
  image,
  active,
  onDeleteClick,
}: {
  image: ImageAsset;
  active: boolean;
  onDeleteClick: (id: number) => void;
}) {
  const router = useRouter();
  const isUploading = image.id < 0;
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: image.id, disabled: isUploading });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...(isUploading ? {} : listeners)}
      className="relative shrink-0 snap-start"
    >
      <img
        src={image.file}
        onClick={() => !isUploading && router.push(`/annotate/${image.id}`)}
        className={cn(
          "h-25 w-25 rounded-md border-2 object-cover",
          isUploading ? "opacity-50" : "cursor-pointer",
          active ? "border-primary" : "border-transparent",
        )}
      />

      {isUploading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Spinner className="size-5 text-white" />
        </div>
      )}

      {!isUploading && (
        <button
          onPointerDownCapture={(e) => e.stopPropagation()}
          onClick={() => onDeleteClick(image.id)}
          aria-label="Remove image"
          className="absolute top-0.5 right-0.5 flex size-4 items-center justify-center rounded-full bg-red-600/90 text-white shadow-md transition hover:bg-red-700 cursor-pointer"
        >
          <Trash2 className="size-3.5" strokeWidth={3} />
        </button>
      )}
    </div>
  );
}

export function ImageSlider() {
  const params = useParams<{ imageId?: string }>();
  const { data, isLoading, reorder, remove } = useImages();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );
  const images = data?.results ?? [];
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const oldIndex = images.findIndex((i) => i.id === active.id);
    const newIndex = images.findIndex((i) => i.id === over.id);
    const moved = arrayMove(images, oldIndex, newIndex);
    reorder.mutate({
      id: Number(active.id),
      data: { order: moved.findIndex((i) => i.id === active.id) },
    });
  };

  if (isLoading) return <Spinner className="size-5" />;
  if (images.length === 0)
    return <EmptyState message="No images uploaded yet" />;

  return (
    <>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <SortableContext
          items={images.map((i) => i.id)}
          strategy={horizontalListSortingStrategy}
        >
          <div className="flex flex-wrap gap-3">
            {images.map((img) => (
              <Thumb
                key={img.id}
                image={img}
                active={String(img.id) === params.imageId}
                onDeleteClick={setDeleteId}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={() => setDeleteId(null)}
        title="Remove image?"
        description="This also deletes all annotations on it."
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
