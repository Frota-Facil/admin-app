import Link from "next/link";
import { updateUserAction } from "@/app/users/actions";
import { UserForm } from "@/app/users/user-form";
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
      <Link href="/">Voltar</Link>
      <h1>Editar usuário</h1>
      <UserForm action={updateUser} user={user} />
    </main>
  );
}
