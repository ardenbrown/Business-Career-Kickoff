import type { ReactNode } from "react";
import Link from "next/link";

import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/roles", label: "Roles" },
  { href: "/resume-feedback", label: "Resume" },
  { href: "/outreach", label: "Outreach" },
  { href: "/application-strategy", label: "Strategy" },
  { href: "/timeline", label: "Timeline" },
  { href: "/jobs", label: "Jobs" },
  { href: "/account", label: "Account" },
];

export async function SiteShell({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-white/60 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link className="flex items-center gap-3" href="/">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white shadow-soft">
              BK
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">Business Career Kickoff</p>
              <p className="text-xs text-muted">AI career hub</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 lg:flex">
            {navItems.map((item) => (
              <Link
                className="rounded-full px-4 py-2 text-sm font-medium text-muted transition hover:bg-primary/5 hover:text-ink"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {session?.user ? (
              <>
                <span className="hidden text-sm text-muted sm:inline">
                  {session.user.email}
                </span>
                <form
                  action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/" });
                  }}
                >
                  <Button size="sm" variant="secondary" type="submit">
                    Sign out
                  </Button>
                </form>
              </>
            ) : (
              <Button asChild size="sm">
                <Link href="/auth/sign-in">Sign in</Link>
              </Button>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
