import { createUserAction } from "@/app/users/actions";
import { UserForm } from "@/app/users/user-form";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageBackHeader } from "@/components/ui/PageBackHeader";

export default function NewUserPage() {
  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-100">
        <header className="border-b border-slate-200 bg-white px-8 py-5">
          <PageBackHeader
            backHref="/users"
            subtitle="Cadastre um novo usuário no sistema"
            title="Novo usuário"
          />
        </header>

        <div className="p-8">
          <UserForm action={createUserAction} />
        </div>
      </div>
    </AdminLayout>
  );
}
