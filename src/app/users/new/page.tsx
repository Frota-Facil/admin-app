import Link from "next/link";
import { createUserAction } from "@/app/users/actions";
import { UserForm } from "@/app/users/user-form";

export default function NewUserPage() {
  return (
    <main>
      <Link href="/">Voltar</Link>
      <h1>Novo usuário</h1>
      <UserForm action={createUserAction} />
    </main>
  );
}
