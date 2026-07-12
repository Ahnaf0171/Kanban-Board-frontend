export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-8 text-center md:flex-row md:text-left">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            Kanban Board
          </h3>

          <p className="max-w-md text-sm leading-6 text-muted-foreground">
            A modern workspace that helps teams organize tasks, track progress,
            and annotate images with an intuitive and collaborative workflow.
          </p>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            Designed & Developed by{" "}
            <span className="font-medium text-foreground">Abdullah Ahnaf</span>
          </p>

          <p>© {new Date().getFullYear()} Kanban Board. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
