import { UsersPanel } from "@/app/users/users-panel";
import { AdminLayout } from "@/components/layout/AdminLayout";
import type { UserResponseDTO } from "@/server/contracts/users/user-schema";
import { redirectCoreUnauthorized } from "@/server/navigation/redirect-core-unauthorized";
import { fetchUsersUseCase } from "@/server/use-cases/fetch-users-use-case";

export default async function UsersPage() {
  const users = await fetchUsersPageData();

  return (
    <AdminLayout>
      <UsersPanel users={users} />
    </AdminLayout>
  );
}

async function fetchUsersPageData(): Promise<UserResponseDTO[]> {
  try {
    return await fetchUsersUseCase();
  } catch (error) {
    redirectCoreUnauthorized(error);
  }
}
