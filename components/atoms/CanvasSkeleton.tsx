export function CanvasSkeleton() {
  return (
    <div className="flex h-115 w-115 animate-pulse items-center justify-center rounded-xl border-4 border-slate-300 bg-slate-100">
      <span className="text-sm text-muted-foreground">Loading…</span>
    </div>
  );
}