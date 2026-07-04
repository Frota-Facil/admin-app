import { updateUserAction } from "@/app/users/actions";
import { UserForm } from "@/app/users/user-form";
import { BackButton } from "@/components/ui/BackButton";
import { fetchUserByIdUseCase } from "@/server/use-cases/fetch-user-by-id-use-case";

type EditUserPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditUserPage({ params }: EditUserPageProps) {
  const { id } = await params;
  const user = await fetchUserByIdUseCase(id);
  const updateUser = updateUserAction.bind(null, id);

  return (
    <main>
      <div className="mb-4">
        <BackButton href="/users" />
      </div>
      <h1>Editar usuário</h1>
      <UserForm action={updateUser} user={user} />
    </main>
  );
}
