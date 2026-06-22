import Link from "next/link";
import Users from "@/components/users";

export default function Home() {
  return (
    <div>
      <h1>Admin App</h1>
      <nav>
        <Link href="/vehicles">Gerenciar veículos</Link>
        <br />
        <Link href="/requests/pending">Ver requisições pendentes</Link>
      </nav>
      <hr />
      <Users />
    </div>
  );
}
