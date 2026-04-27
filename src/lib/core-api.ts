import axios from "axios";
import { cookies } from "next/headers";

export function getCoreApi() {
  const token = cookies().get("token")?.value;

  return axios.create({
    baseURL: process.env.CORE_API_URL,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
}