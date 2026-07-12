import Link from "next/link";
import { Button } from "@/components/atoms/Button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-3 p-10">
      <p className="text-sm text-muted-foreground">Image not found.</p>

      <Link href="/annotate">
        <Button>Back to gallery</Button>
      </Link>
    </div>
  );
}
