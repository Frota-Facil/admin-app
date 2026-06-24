import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type CoreApiOptions = {
  requireToken?: boolean;
};

export async function getCoreApi(options: CoreApiOptions = {}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (options.requireToken && !token) {
    redirect("/login");
  }

  return axios.create({
    baseURL: process.env.CORE_API_URL,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}
