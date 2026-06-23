import { UsersPanel } from "@/app/users/users-panel";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { fetchUsersUseCase } from "@/server/use-cases/fetch-users-use-case";

export default async function UsersPage() {
  const users = await fetchUsersUseCase();

  return (
    <AdminLayout>
      <UsersPanel users={users} />
    </AdminLayout>
  );
}
