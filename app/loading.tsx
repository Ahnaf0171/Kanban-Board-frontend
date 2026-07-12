import { Spinner } from "@/components/atoms/Spinner";

export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Spinner className="size-6" />
    </div>
  );
}
