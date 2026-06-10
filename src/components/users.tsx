import Link from "next/link";
import { deleteUserAction } from "@/app/users/actions";
import { fetchUsersUseCase } from "@/server/use-cases/fetch-users-use-case";

export default async function Users() {
  const users = await fetchUsersUseCase();

  return (
    <section>
      <h1>Usuários</h1>
      <Link href="/users/new">Novo usuário</Link>

      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.role}{" "}
            <Link href={`/users/${user.id}/edit`}>Editar</Link>
            <form action={deleteUserAction.bind(null, user.id)}>
              <button type="submit">Excluir</button>
            </form>
          </li>
        ))}
      </ul>
    </section>
  );
}
