import { UploadButton } from "@/components/organisms/shared/UploadButton";
import { ImageSlider } from "@/components/organisms/annotation/ImageSlider";

export const dynamic = "force-dynamic";

export default function AnnotatePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Annotate</h1>
        <UploadButton />
      </div>
      <ImageSlider />
    </div>
  );
}
