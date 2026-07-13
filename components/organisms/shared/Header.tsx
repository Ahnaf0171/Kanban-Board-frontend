import Link from "next/link";
import { getCurrentUser, logoutAction } from "@/lib/actions/auth";
import { Avatar } from "@/components/atoms/Avatar";
import { Button } from "@/components/atoms/Button";
import { HeaderNav } from "@/components/organisms/marketing/HeaderNav";
import type { User } from "@/types/auth";

interface HeaderProps {
  user?: User;
}

export async function Header({ user }: HeaderProps) {
  const currentUser = user ?? (await getCurrentUser());

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-line bg-paper/80 px-6 py-3 backdrop-blur">
      <Link href="/" className="text-sm font-semibold text-ink">
        Kanban <span className="text-signal"> Board</span>
      </Link>
      {!currentUser && <HeaderNav />}
      {currentUser ? (
        <Link
          href="/tasks"
          className="flex items-center gap-3 hover:opacity-80"
        >
          <Avatar name={`${currentUser.first_name} ${currentUser.last_name}`} />
          <span className="text-sm font-medium text-ink">
            {currentUser.first_name} {currentUser.last_name}
          </span>
        </Link>
      ) : (
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Log in
            </Button>
          </Link>
          <Link href="/registration">
            <Button size="sm">Get started</Button>
          </Link>
        </div>
      )}

      {currentUser && (
        <form action={logoutAction}>
          <Button type="submit" variant="ghost" size="sm">
            Log out
          </Button>
        </form>
      )}
    </header>
  );
}
