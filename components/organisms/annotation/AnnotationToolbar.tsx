"use client";

import { useRef, useState } from "react";
import { useAnnotations } from "@/hooks/useAnnotations";
import { useAnnotationUIStore } from "@/store/annotationUIStore";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";
import { MIN_POLYGON_POINTS, DEFAULT_ANNOTATION_COLOR } from "@/lib/constants";

export function AnnotationToolbar({ imageId }: { imageId: number }) {
  const { create } = useAnnotations(imageId);
  const { draftPoints, resetDraft } = useAnnotationUIStore();
  const [label, setLabel] = useState("");
  const [labelError, setLabelError] = useState(false);
  const labelInputRef = useRef<HTMLInputElement>(null);

  const hasEnoughPoints = draftPoints.length >= MIN_POLYGON_POINTS;

  const handleSave = async () => {
    if (!label.trim()) {
      setLabelError(true);
      labelInputRef.current?.focus();
      return;
    }

    await create.mutateAsync({
      image: imageId,
      points: draftPoints,
      label,
      color: DEFAULT_ANNOTATION_COLOR,
    });
    setLabel("");
    setLabelError(false);
    resetDraft();
  };

  return (
    <div className="flex items-start gap-2">
      <div className="flex flex-col gap-1">
        <Input
          ref={labelInputRef}
          placeholder="Label"
          value={label}
          onChange={(e) => {
            setLabel(e.target.value);
            if (labelError) setLabelError(false);
          }}
          className={
            labelError
              ? "w-40 border-red-500 focus-visible:ring-red-500"
              : "w-40"
          }
        />
        {labelError && (
          <span className="text-xs text-red-600">
            Add a label before saving
          </span>
        )}
      </div>

      <span className="mt-2 text-xs text-muted-foreground">
        {draftPoints.length} point(s)
      </span>

      <Button
        size="lg"
        onClick={handleSave}
        disabled={!hasEnoughPoints || create.isPending}
        className="rounded-md bg-amber-700 text-white hover:bg-amber-800 disabled:bg-amber-700/50"
      >
        Save polygon
      </Button>

      <Button
        size="lg"
        variant="ghost"
        onClick={resetDraft}
        disabled={draftPoints.length === 0}
      >
        Cancel
      </Button>
    </div>
  );
}
