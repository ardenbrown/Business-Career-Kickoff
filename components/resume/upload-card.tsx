"use client";

import { useState, useTransition } from "react";

import { uploadResumeAction } from "@/lib/actions/resume";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function ResumeUploadCard() {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-ink">Upload resume PDF</h3>
          <p className="text-sm leading-7 text-muted">
            Your resume will be stored privately in your account and used only to generate
            personalized feedback. It will not be shared with other users or third parties.
          </p>
        </div>
        <form
          action={(formData) => {
            setMessage("");
            startTransition(async () => {
              try {
                await uploadResumeAction(formData);
                setMessage("Resume uploaded and analyzed.");
              } catch (error) {
                setMessage(error instanceof Error ? error.message : "Upload failed.");
              }
            });
          }}
          className="space-y-4"
        >
          <Input accept="application/pdf" name="resume" type="file" />
          <Button disabled={isPending} type="submit">
            {isPending ? "Uploading..." : "Upload PDF"}
          </Button>
        </form>
        {message ? <p className="text-sm text-primary">{message}</p> : null}
      </div>
    </Card>
  );
}
