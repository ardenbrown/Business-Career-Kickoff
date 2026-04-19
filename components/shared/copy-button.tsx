"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

export function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <Button
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }}
      size="sm"
      variant="secondary"
    >
      {copied ? "Copied" : "Copy"}
    </Button>
  );
}
