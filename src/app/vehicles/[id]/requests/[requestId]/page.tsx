import { notFound } from "next/navigation";
import { RequestDetailsPanel } from "@/app/vehicles/[id]/requests/[requestId]/request-details-panel";
import {
  approveRequestAction,
  rejectRequestAction,
} from "@/app/vehicles/[id]/requests/actions";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { fetchRequestByIdUseCase } from "@/server/use-cases/fetch-request-by-id-use-case";
import { fetchUsersUseCase } from "@/server/use-cases/fetch-users-use-case";
import { fetchVehiclesUseCase } from "@/server/use-cases/fetch-vehicles-use-case";

type RequestDetailPageProps = {
  params: Promise<{ id: string; requestId: string }>;
  searchParams: Promise<{ from?: string }>;
};

export default async function RequestDetailPage({
  params,
  searchParams,
}: RequestDetailPageProps) {
  const { id, requestId } = await params;
  const { from } = await searchParams;
  const [request, users, vehicles] = await Promise.all([
    fetchRequestByIdUseCase(requestId),
    fetchUsersUseCase(),
    fetchVehiclesUseCase(),
  ]);

  if (!request) {
    notFound();
  }

  const user = users.find((currentUser) => currentUser.id === request.userId);
  const vehicle = vehicles.find(
    (currentVehicle) => currentVehicle.id === request.vehicleId,
  );
  const approver = request.approvedBy
    ? (users.find((currentUser) => currentUser.id === request.approvedBy) ??
      null)
    : null;

  return (
    <AdminLayout>
      <RequestDetailsPanel
        approver={approver}
        backHref={
          from === "requests" ? "/requests" : `/vehicles/${id}/requests`
        }
        request={request}
        user={user ?? null}
        vehicle={vehicle ?? null}
      >
        {request.status === "PENDING" ? (
          <RequestApprovalActions requestId={requestId} vehicleId={id} />
        ) : null}
      </RequestDetailsPanel>
    </AdminLayout>
  );
}

type RequestApprovalActionsProps = {
  requestId: string;
  vehicleId: string;
};

function RequestApprovalActions({
  requestId,
  vehicleId,
}: RequestApprovalActionsProps) {
  return (
    <>
      <form action={approveRequestAction.bind(null, vehicleId, requestId)}>
        <button
          className="inline-flex h-9 items-center justify-center rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-100"
          type="submit"
        >
          Aprovar
        </button>
      </form>
      <form action={rejectRequestAction.bind(null, vehicleId, requestId)}>
        <button
          className="inline-flex h-9 items-center justify-center rounded-lg bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-100"
          type="submit"
        >
          Rejeitar
        </button>
      </form>
    </>
  );
}
