"use client";

import { Suspense, useState } from "react";
import { ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { CanvasSkeleton } from "@/components/atoms/CanvasSkeleton";
import { ErrorBoundary } from "@/components/molecules/ErrorBoundary";
import { CanvasStage } from "@/components/organisms/annotation/CanvasStage";

const ZOOM_STEP = 0.25;
const MIN_ZOOM = 1;
const MAX_ZOOM = 3;

export function Canvas({ imageId }: { imageId: number }) {
  const [prevImageId, setPrevImageId] = useState(imageId);
  const [zoom, setZoom] = useState(MIN_ZOOM);

  if (imageId !== prevImageId) {
    setPrevImageId(imageId);
    setZoom(MIN_ZOOM);
  }

  return (
    <div className="space-y-2">
      <ErrorBoundary fallback={<CanvasErrorState />}>
        <Suspense fallback={<CanvasSkeleton />}>
          <CanvasStage imageId={imageId} zoom={zoom} />
        </Suspense>
      </ErrorBoundary>

      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          size="icon-sm"
          disabled={zoom <= MIN_ZOOM}
          onClick={() => setZoom((z) => Math.max(MIN_ZOOM, z - ZOOM_STEP))}
          aria-label="Zoom out"
        >
          <ZoomOut className="size-4" />
        </Button>
        <span className="text-xs text-muted-foreground">
          {Math.round(zoom * 100)}%
        </span>
        <Button
          variant="outline"
          size="icon-sm"
          disabled={zoom >= MAX_ZOOM}
          onClick={() => setZoom((z) => Math.min(MAX_ZOOM, z + ZOOM_STEP))}
          aria-label="Zoom in"
        >
          <ZoomIn className="size-4" />
        </Button>
      </div>
    </div>
  );
}

function CanvasErrorState() {
  return (
    <div className="flex h-115 w-115 items-center justify-center rounded-xl border-4 border-red-200 bg-red-50">
      <span className="text-sm text-red-600">
        Couldn&apos;t load this image.
      </span>
    </div>
  );
}
