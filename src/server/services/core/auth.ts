import axios from "axios";

export async function auth(cpf: string, senha: string) {
  const { data } = await axios.post(
    `${process.env.CORE_API_URL}/auth`,
    { cpf, senha }
  );

  return data;
}