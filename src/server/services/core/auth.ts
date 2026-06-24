import axios from "axios";

export async function auth(cpf: string, password: string) {
  const { data } = await axios.post(`${process.env.CORE_API_URL}/admin/auth`, {
    cpf,
    password,
  });

  return data;
}
