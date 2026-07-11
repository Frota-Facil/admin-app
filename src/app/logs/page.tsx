import { LogsPanel } from "@/app/logs/logs-panel";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { fetchAuditLogsUseCase } from "@/server/use-cases/fetch-audit-logs-use-case";
import { fetchUsersUseCase } from "@/server/use-cases/fetch-users-use-case";

export default async function LogsPage() {
  const [{ data: logs }, users] = await Promise.all([
    fetchAuditLogsUseCase(),
    fetchUsersUseCase(),
  ]);

  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-100">
        <header className="border-b border-slate-200 bg-white px-8 py-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-normal text-slate-950">
                Logs
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Registro de atividades do sistema
              </p>
            </div>
          </div>
        </header>

        <div className="p-8">
          <LogsPanel logs={logs} users={users} />
        </div>
      </div>
    </AdminLayout>
  );
}
