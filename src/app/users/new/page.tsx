import { createUserAction } from "@/app/users/actions";
import { UserForm } from "@/app/users/user-form";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { BackButton } from "@/components/ui/BackButton";

export default function NewUserPage() {
  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-100">
        <header className="border-b border-slate-200 bg-white px-8 py-5">
          <div>
            <div className="mb-4">
              <BackButton href="/users" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-normal text-slate-950">
                Novo usuário
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Cadastre um novo usuário no sistema
              </p>
            </div>
          </div>
        </header>

        <div className="p-8">
          <UserForm action={createUserAction} />
        </div>
      </div>
    </AdminLayout>
  );
}
