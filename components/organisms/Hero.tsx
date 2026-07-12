import Link from "next/link";
import { Button } from "@/components/atoms/Button";

export function Hero() {
  return (
    <section className="mx-auto flex max-w-6xl flex-col items-center px-6 py-24 text-center">
      <span className="mono rounded-full border border-line bg-paper-raised px-3 py-1 text-xs text-ink-muted">
        Boards · Drag & drop · Image annotation
      </span>

      <h1 className="mt-6 max-w-2xl text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
        Plan your work. Annotate your images.
        <span className="text-signal"> One board.</span>
      </h1>

      <p className="mt-4 max-w-xl text-ink-muted">
        A Kanban board built for teams that also need pixel-level image review —
        tag tasks, drag between columns, and annotate assets without leaving the
        workflow.
      </p>

      <div className="mt-8 flex gap-3">
        <Link href="/registration">
          <Button size="lg">Start for free</Button>
        </Link>
        <a href="#features">
          <Button variant="outline" size="lg">
            See features
          </Button>
        </a>
      </div>
    </section>
  );
}
