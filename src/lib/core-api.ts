import axios from "axios";
import { cookies } from "next/headers";

export async function getCoreApi() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  return axios.create({
    baseURL: process.env.CORE_API_URL,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
}
