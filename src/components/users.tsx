import { fetchUsersUseCase } from "@/server/use-cases/fetch-users-use-case";

export default async function Users() {
  const users = await fetchUsersUseCase();

  return (
    <div>
      <h1>Usuários</h1>

      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.role}
          </li>
        ))}
      </ul>
    </div>
  );
}