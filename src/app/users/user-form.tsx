import type { UserResponseDTO } from "@/server/contracts/users/user-schema";

type UserFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  user?: UserResponseDTO;
};

export function UserForm({ action, user }: UserFormProps) {
  return (
    <form action={action}>
      <label>
        Nome
        <input name="name" defaultValue={user?.name} required />
      </label>

      <label>
        E-mail
        <input name="email" type="email" defaultValue={user?.email} required />
      </label>

      <label>
        Senha
        <input name="password" type="password" required={!user} />
      </label>

      <label>
        CPF
        <input
          name="cpf"
          defaultValue={user?.cpf}
          minLength={11}
          maxLength={11}
          required
        />
      </label>

      <label>
        CNH
        <input
          name="cnh"
          defaultValue={user?.cnh ?? ""}
          minLength={11}
          maxLength={11}
        />
      </label>

      <label>
        Telefone
        <input
          name="phone"
          defaultValue={user?.phone}
          minLength={10}
          maxLength={14}
          required
        />
      </label>

      <label>
        Departamento
        <input name="department" defaultValue={user?.department ?? ""} />
      </label>

      <label>
        Perfil
        <select name="role" defaultValue={user?.role ?? "driver"}>
          <option value="driver">Motorista</option>
          <option value="admin">Administrador</option>
        </select>
      </label>

      <button type="submit">Salvar</button>
    </form>
  );
}
