import { getCoreApi } from "@/lib/core-api";
import {
  type UploadPresignedRequestDTO,
  uploadPresignedResponseSchema,
} from "@/server/contracts/upload-presigned";

export async function createUploadPresignedUrl(
  input: UploadPresignedRequestDTO,
) {
  const api = await getCoreApi();
  const { data } = await api.post("/admin/upload/presigned", input);
  const response = uploadPresignedResponseSchema.parse(data);

  if (!process.env.MINIO_UPLOAD_HOST) {
    return response;
  }

  const uploadUrl = new URL(response.uploadUrl);
  const signedUploadHost = uploadUrl.host;
  uploadUrl.hostname = process.env.MINIO_UPLOAD_HOST;

  return {
    ...response,
    uploadUrl: uploadUrl.toString(),
    signedUploadHost,
  };
}
