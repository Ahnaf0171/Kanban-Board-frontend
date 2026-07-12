"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/atoms/Dialog";
import { LoginForm } from "@/components/organisms/LoginForm";

export function LoginModal() {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    router.push("/");
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && handleClose()}>
      <DialogContent className="max-w-[380px] gap-0 overflow-hidden rounded-2xl border border-border/60 bg-card p-0 shadow-2xl [&>button]:hidden">
        <div className="relative flex flex-col items-center gap-4 px-8 pb-2 pt-9">
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close login"
            className="absolute right-4 top-4 z-10 rounded-full p-1.5 text-muted-foreground/70 transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-end gap-1.5">
            <span className="h-5 w-1.5 rounded-full bg-muted-foreground/30" />
            <span className="h-7 w-1.5 rounded-full bg-primary/60" />
            <span className="h-4 w-1.5 rounded-full bg-primary" />
          </div>

          <div className="space-y-1 text-center">
            <h1 className="text-lg font-semibold tracking-tight text-card-foreground">
              Welcome to Kanban Board
            </h1>
          </div>
        </div>

        <div className="px-8 pb-8 pt-5">
          <LoginForm />

          <div className="mt-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            New here?{" "}
            <Link
              href="/registration"
              className="text-blue-700 font-bold underline-offset-4 hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
