import { getCoreApi } from "@/lib/core-api";
import {
  type UploadPresignedRequestDTO,
  type UploadPresignedResponseDTO,
  uploadPresignedResponseSchema,
} from "@/server/contracts/upload-presigned";

export async function createUploadPresignedUrl(
  input: UploadPresignedRequestDTO,
): Promise<UploadPresignedResponseDTO> {
  const api = await getCoreApi();
  const { data } = await api.post("/admin/upload/presigned", {
    ...input,
    uploadHost: process.env.MINIO_UPLOAD_HOST,
  });

  return uploadPresignedResponseSchema.parse(data);
}
