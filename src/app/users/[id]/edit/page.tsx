import { updateUserAction } from "@/app/users/actions";
import { UserForm } from "@/app/users/user-form";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { NotificationBell } from "@/components/layout/NotificationBell";
import { PageBackHeader } from "@/components/ui/PageBackHeader";
import { fetchUserByIdUseCase } from "@/server/use-cases/fetch-user-by-id-use-case";

type EditUserPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditUserPage({ params }: EditUserPageProps) {
  const { id } = await params;
  const user = await fetchUserByIdUseCase(id);
  const updateUser = updateUserAction.bind(null, id);

  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-100">
        <header className="border-b border-slate-200 bg-white px-8 py-5">
          <PageBackHeader
            actions={<NotificationBell />}
            backHref="/users"
            subtitle="Atualize os dados de acesso e identificação do usuário"
            title="Editar usuário"
          />
        </header>

        <div className="p-8">
          <UserForm action={updateUser} user={user} />
        </div>
      </div>
    </AdminLayout>
  );
}
