import { z } from "zod";

export const resumeUploadSchema = z.object({
  tone: z.string().optional(),
});

export const MAX_RESUME_SIZE = 5 * 1024 * 1024;
