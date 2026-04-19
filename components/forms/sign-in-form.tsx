"use client";

import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";

import { signInSchema } from "@/lib/validators/profile";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";

export function SignInForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <Card className="mx-auto max-w-xl p-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-ink">Sign in with email</h1>
          <p className="text-sm leading-7 text-muted">
            Enter your email and we’ll send a magic link. Resume files, saved outputs, and job
            bookmarks stay private to your account.
          </p>
        </div>
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            const parsed = signInSchema.safeParse({ email });
            if (!parsed.success) {
              setMessage(parsed.error.issues[0]?.message ?? "Enter a valid email.");
              return;
            }

            startTransition(async () => {
              await signIn("resend", {
                email,
                callbackUrl,
                redirect: false,
              });
              setMessage("Check your inbox for the sign-in link.");
            });
          }}
        >
          <Input
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            type="email"
            value={email}
          />
          <Button className="w-full" disabled={isPending} type="submit">
            {isPending ? "Sending link..." : "Send magic link"}
          </Button>
        </form>
        {message ? <p className="text-sm text-primary">{message}</p> : null}
      </div>
    </Card>
  );
}
