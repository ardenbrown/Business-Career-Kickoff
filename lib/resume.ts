import pdfParse from "pdf-parse";

import { MAX_RESUME_SIZE } from "@/lib/validators/resume";

export async function parseResumeFile(file: File) {
  if (file.type !== "application/pdf") {
    throw new Error("Only PDF resumes are supported.");
  }

  if (file.size > MAX_RESUME_SIZE) {
    throw new Error("Resume must be 5MB or smaller.");
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const parsed = await pdfParse(buffer);

  if (!parsed.text.trim()) {
    throw new Error("We could not extract text from this PDF.");
  }

  return {
    buffer,
    text: parsed.text,
    size: file.size,
    mimeType: file.type,
    fileName: file.name,
  };
}
