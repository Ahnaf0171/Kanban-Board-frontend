import Link from "next/link";
import { Button } from "@/components/atoms/Button";

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-3">
      <p className="text-sm text-muted-foreground">Page not found.</p>

      <Link href="/tasks">
        <Button>Go to tasks</Button>
      </Link>
    </div>
  );
}
