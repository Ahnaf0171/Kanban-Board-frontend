"use client";

import { useRef } from "react";
import { Stage, Layer, Image as KonvaImage, Line } from "react-konva";
import useImg from "use-image";
import { useImage } from "@/hooks/useImages";
import { useAnnotationUIStore } from "@/store/annotationUIStore";
import { CanvasSkeleton } from "@/components/atoms/CanvasSkeleton";
import { DEFAULT_ANNOTATION_COLOR } from "@/lib/constants";
import type { StageProps } from "react-konva";

const WINDOW_SIZE = 460;

export function CanvasStage({
  imageId,
  zoom,
}: {
  imageId: number;
  zoom: number;
}) {
  const { data: image } = useImage(imageId);
  const [el] = useImg(image.file);
  const { draftPoints, addDraftPoint, selectedAnnotationId, selectAnnotation } =
    useAnnotationUIStore();
  const stageRef = useRef(null);

  if (!el) return <CanvasSkeleton />;

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
    <div className="h-115 w-115 overflow-hidden rounded-xl border-4 border-slate-500 bg-slate-50">
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
  );
}
