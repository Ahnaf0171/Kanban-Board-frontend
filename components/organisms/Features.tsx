// components/organisms/FeaturesSection.tsx
import { LayoutGrid, MousePointerClick, ImagePlus, Tags } from "lucide-react";

const FEATURES = [
  {
    icon: LayoutGrid,
    title: "Drag-and-drop board",
    desc: "Move tasks across To Do, In Progress, and Done with automatic order reindexing.",
  },
  {
    icon: Tags,
    title: "Tags & priorities",
    desc: "Attach color-coded tags and priority levels to keep the board scannable.",
  },
  {
    icon: ImagePlus,
    title: "Image uploads",
    desc: "Attach and reorder images per task, stored securely with size and type checks.",
  },
  {
    icon: MousePointerClick,
    title: "Polygon annotation",
    desc: "Draw, edit, and label polygons directly on uploaded images.",
  },
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="text-center text-3xl font-semibold tracking-tight text-ink">
        Everything the workflow needs
      </h2>
      <p className="mx-auto mt-3 max-w-md text-center text-ink-muted">
        Task management and image review, in the same board.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="rounded-lg border border-line bg-paper-raised p-6 transition-shadow hover:shadow-sm"
          >
            <div className="flex size-10 items-center justify-center rounded-md bg-signal-soft text-signal">
              <Icon size={20} />
            </div>
            <h3 className="mt-4 font-medium text-ink">{title}</h3>
            <p className="mt-1.5 text-sm text-ink-muted">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
