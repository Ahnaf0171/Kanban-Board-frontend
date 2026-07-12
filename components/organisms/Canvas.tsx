"use client";

import { useRef, useState } from "react";
import { Stage, Layer, Image as KonvaImage, Line } from "react-konva";
import useImg from "use-image";
import { ZoomIn, ZoomOut } from "lucide-react";
import { useImage } from "@/hooks/useImages";
import { useAnnotations } from "@/hooks/useAnnotations";
import { useAnnotationUIStore } from "@/store/annotationUIStore";
import { DEFAULT_ANNOTATION_COLOR } from "@/lib/constants";
import { Button } from "@/components/atoms/Button";
import type { StageProps } from "react-konva";

const WINDOW_SIZE = 460;
const ZOOM_STEP = 0.25;
const MAX_ZOOM = 3;

export function Canvas({ imageId }: { imageId: number }) {
  const { data: image } = useImage(imageId);
  const [el] = useImg(image?.file ?? "");
  const { update } = useAnnotations(imageId);
  const { draftPoints, addDraftPoint, selectedAnnotationId, selectAnnotation } =
    useAnnotationUIStore();
  const [zoom, setZoom] = useState(1);
  const stageRef = useRef(null);

  if (!image || !el) {
    return (
      <div className="flex h-115 w-115 items-center justify-center rounded-xl border-4 border-slate-300 bg-slate-50">
        <span className="text-sm text-muted-foreground">Loading…</span>
      </div>
    );
  }

  const coverScale = Math.max(
    WINDOW_SIZE / el.naturalWidth,
    WINDOW_SIZE / el.naturalHeight,
  );
  const scale = coverScale * zoom;
  const drawWidth = el.naturalWidth * scale;
  const drawHeight = el.naturalHeight * scale;
  const offsetX = (WINDOW_SIZE - drawWidth) / 2;
  const offsetY = (WINDOW_SIZE - drawHeight) / 2;

  const toImageCoords = (x: number, y: number) => ({
    x: (x - offsetX) / scale,
    y: (y - offsetY) / scale,
  });
  const toScreenCoords = (p: { x: number; y: number }) => [
    p.x * scale + offsetX,
    p.y * scale + offsetY,
  ];

  const handleStageClick: NonNullable<StageProps["onClick"]> = (e) => {
    if (e.target !== e.target.getStage() && e.target.name() !== "bg") return;
    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;
    addDraftPoint(toImageCoords(pos.x, pos.y));
  };

  return (
    <div className="space-y-2">
      <div className="h-115 w-115 overflow-hidden rounded-xl border-4 border-slate-300 bg-slate-50">
        <Stage
          width={WINDOW_SIZE}
          height={WINDOW_SIZE}
          ref={stageRef}
          onClick={handleStageClick}
        >
          <Layer>
            <KonvaImage
              image={el}
              name="bg"
              x={offsetX}
              y={offsetY}
              width={drawWidth}
              height={drawHeight}
            />

            {image.annotations.map((a) => (
              <Line
                key={a.id}
                points={a.points.flatMap(toScreenCoords)}
                closed
                stroke={a.color}
                strokeWidth={selectedAnnotationId === a.id ? 3 : 2}
                fill={`${a.color}33`}
                onClick={(e) => {
                  e.cancelBubble = true;
                  selectAnnotation(a.id);
                }}
              />
            ))}

            {draftPoints.length > 0 && (
              <Line
                points={draftPoints.flatMap(toScreenCoords)}
                stroke={DEFAULT_ANNOTATION_COLOR}
                strokeWidth={2}
                dash={[4, 4]}
              />
            )}
          </Layer>
        </Stage>
      </div>

      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          size="icon-sm"
          disabled={zoom <= 1}
          onClick={() => setZoom((z) => Math.max(1, z - ZOOM_STEP))}
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
