import { z } from "zod";

export const uploadPresignedRequestSchema = z.object({
  contentType: z.string().trim().min(1),
});

export const uploadPresignedResponseSchema = z.object({
  uploadUrl: z.string().trim().min(1),
  fileUrl: z.string().trim().min(1),
  key: z.string().trim().min(1),
});

export type UploadPresignedRequestDTO = z.infer<
  typeof uploadPresignedRequestSchema
>;

export type UploadPresignedResponseDTO = z.infer<
  typeof uploadPresignedResponseSchema
>;
