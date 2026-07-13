import { UsersPanel } from "@/app/users/users-panel";
import { AdminLayout } from "@/components/layout/AdminLayout";
import type { UserResponseDTO } from "@/server/contracts/users/user-schema";
import { redirectCoreUnauthorized } from "@/server/navigation/redirect-core-unauthorized";
import { fetchUsersUseCase } from "@/server/use-cases/fetch-users-use-case";

type UsersPageProps = {
  searchParams: Promise<{ details?: string }>;
};

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const { details } = await searchParams;
  const users = await fetchUsersPageData();

  return (
    <AdminLayout>
      <UsersPanel initialSelectedUserId={details} users={users} />
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
