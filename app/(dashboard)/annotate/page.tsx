import { UploadButton } from "@/components/organisms/UploadButton";
import { ImageSlider } from "@/components/organisms/ImageSlider";
import { EmptyState } from "@/components/organisms/EmptyState";

export default function AnnotatePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Annotate</h1>
        <UploadButton />
      </div>
      <ImageSlider />
      <EmptyState message="Select an image to start annotating" />
    </div>
  );
}
