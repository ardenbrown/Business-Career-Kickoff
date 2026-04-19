"use client";

import { useState, useTransition } from "react";

import { regenerateOutputsAction } from "@/lib/actions/profile";
import { Button } from "@/components/ui/button";

export function RegenerateButton() {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-2">
      <Button
        disabled={isPending}
        onClick={() => {
          setMessage("");
          startTransition(async () => {
            try {
              await regenerateOutputsAction();
              setMessage("Insights regenerated.");
            } catch (error) {
              setMessage(error instanceof Error ? error.message : "Regeneration failed.");
            }
          });
        }}
        variant="secondary"
      >
        {isPending ? "Regenerating..." : "Regenerate insights"}
      </Button>
      {message ? <p className="text-xs text-muted">{message}</p> : null}
    </div>
  );
}
