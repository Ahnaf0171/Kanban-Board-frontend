import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Canvas } from "@/components/organisms/annotation/Canvas";
import { AnnotationToolbar } from "@/components/organisms/annotation/AnnotationToolbar";
import { AnnotationList } from "@/components/organisms/annotation/AnnotationList";
import { ImageNavButtons } from "@/components/organisms/annotation/ImageNavButtons";

export default async function ImageAnnotatePage({
  params,
}: {
  params: Promise<{ imageId: string }>;
}) {
  const { imageId } = await params;
  const id = Number(imageId);
  if (isNaN(id)) notFound();

  return (
    <div className="space-y-4">
      <Link
        href="/annotate"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to gallery
      </Link>

      <div className="flex gap-6">
        <div className="space-y-3">
          <Canvas imageId={id} />
          <AnnotationToolbar imageId={id} />
          <ImageNavButtons currentId={id} />
        </div>
        <div className="w-56 shrink-0">
          <AnnotationList imageId={id} />
        </div>
      </div>
    </div>
  );
}
