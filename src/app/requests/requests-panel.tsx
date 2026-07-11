"use client";

import { Funnel } from "lucide-react";
import Link from "next/link";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import {
  approveRequestAction,
  rejectRequestAction,
} from "@/app/requests/actions";

export type RequestListItem = {
  createdAt: string;
  department: string;
  destination: string;
  endDate: string;
  id: string;
  reason: string;
  startDate: string;
  status: string;
  userId: string;
  userName: string;
  vehicleId: string;
  vehicleModel: string;
  vehiclePlate: string;
};

type RequestsPanelProps = {
  requests: RequestListItem[];
};

type FilterStatus = "ALL" | "PENDING" | "APPROVED" | "REJECTED";
type SearchField = "destination" | "name" | "plate";

const filterOptions = [
  { label: "Todas", value: "ALL" },
  { label: "Pendentes", value: "PENDING" },
  { label: "Aprovadas", value: "APPROVED" },
  { label: "Recusadas", value: "REJECTED" },
] satisfies { label: string; value: FilterStatus }[];

const statusDisplay = {
  APPROVED: {
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    label: "Aprovado",
  },
  COMPLETED: {
    className: "border-blue-200 bg-blue-50 text-blue-700",
    label: "Concluido",
  },
  PENDING: {
    className: "border-amber-200 bg-amber-50 text-amber-700",
    label: "Pendente",
  },
  REJECTED: {
    className: "border-red-200 bg-red-50 text-red-700",
    label: "Recusado",
  },
} satisfies Record<string, { className: string; label: string }>;

const statusPriority = {
  PENDING: 0,
  APPROVED: 1,
  REJECTED: 2,
  COMPLETED: 3,
} satisfies Record<string, number>;

const searchFieldOptions = [
  { label: "Nome", value: "name" },
  { label: "Placa", value: "plate" },
  { label: "Destino", value: "destination" },
] satisfies { label: string; value: SearchField }[];

export function RequestsPanel({ requests }: RequestsPanelProps) {
  const [search, setSearch] = useState("");
  const [currentFilter, setCurrentFilter] = useState<FilterStatus>("ALL");
  const [selectedSearchFields, setSelectedSearchFields] = useState<
    SearchField[]
  >([]);

  const counts = useMemo(() => {
    return requests.reduce(
      (accumulator, request) => {
        const status = normalizeStatus(request.status);

        if (status === "PENDING") {
          accumulator.PENDING += 1;
        }

        if (status === "APPROVED") {
          accumulator.APPROVED += 1;
        }

        if (status === "REJECTED") {
          accumulator.REJECTED += 1;
        }

        return accumulator;
      },
      { APPROVED: 0, PENDING: 0, REJECTED: 0 },
    );
  }, [requests]);

  const filteredRequests = useMemo(() => {
    const normalizedSearch = normalizeText(search);

    return requests
      .filter((request) => {
        const status = normalizeStatus(request.status);
        const matchesFilter =
          currentFilter === "ALL" || status === currentFilter;

        if (!matchesFilter) {
          return false;
        }

        if (!normalizedSearch) {
          return true;
        }

        const searchableFields = getSearchableFields(
          request,
          selectedSearchFields,
        );

        return searchableFields.some((field) =>
          normalizeText(field).includes(normalizedSearch),
        );
      })
      .sort(compareRequests);
  }, [currentFilter, requests, search, selectedSearchFields]);

  function handleSearchFieldToggle(field: SearchField) {
    setSelectedSearchFields((currentFields) => {
      if (currentFields.includes(field)) {
        return currentFields.filter((currentField) => currentField !== field);
      }

      return [...currentFields, field];
    });
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white px-8 py-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-normal text-slate-950">
              Solicitações de Veículos
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Aprovação e controle de uso
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3">
            <label className="relative block w-[280px] max-w-full">
              <span className="sr-only">Buscar solicitações</span>
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar..."
                type="search"
                value={search}
              />
            </label>

            <SearchFieldFilter
              onClear={() => setSelectedSearchFields([])}
              onToggleField={handleSearchFieldToggle}
              selectedFields={selectedSearchFields}
            />
          </div>
        </div>
      </header>

      <div className="space-y-5 p-8">
        <RequestFilters
          counts={counts}
          currentFilter={currentFilter}
          onFilterChange={setCurrentFilter}
        />

        {filteredRequests.length === 0 ? (
          <section className="rounded-lg border border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Nenhuma solicitação encontrada.
            </p>
          </section>
        ) : (
          <section className="space-y-3">
            {filteredRequests.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </section>
        )}
      </div>
    </div>
  );
}

type SearchFieldFilterProps = {
  onClear: () => void;
  onToggleField: (field: SearchField) => void;
  selectedFields: SearchField[];
};

function SearchFieldFilter({
  onClear,
  onToggleField,
  selectedFields,
}: SearchFieldFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const activeFilterCount = selectedFields.length;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target;

      if (target instanceof Node && !wrapperRef.current?.contains(target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen]);

  return (
    <div className="relative shrink-0" ref={wrapperRef}>
      <button
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="Filtrar campos da busca"
        className={`relative inline-flex h-10 w-10 items-center justify-center rounded-lg border bg-white shadow-sm transition focus:outline-none focus:ring-4 focus:ring-blue-100 ${
          activeFilterCount > 0
            ? "border-blue-200 text-blue-700 hover:border-blue-300"
            : "border-slate-200 text-slate-500 hover:border-blue-200 hover:text-blue-700"
        }`}
        onClick={() => setIsOpen((current) => !current)}
        title="Filtrar busca"
        type="button"
      >
        <Funnel aria-hidden="true" className="h-5 w-5" />
        {activeFilterCount > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[11px] font-bold leading-none text-white ring-2 ring-white">
            {activeFilterCount}
          </span>
        ) : null}
      </button>

      {isOpen ? (
        <div
          className="absolute right-0 top-full z-40 mt-2 w-56 rounded-lg border border-slate-200 bg-white p-3 shadow-lg"
          role="menu"
        >
          <p className="px-2 pb-2 text-xs font-bold uppercase tracking-normal text-slate-500">
            Filtrar busca por
          </p>

          <div className="space-y-1">
            {searchFieldOptions.map((option) => {
              const isChecked = selectedFields.includes(option.value);

              return (
                <label
                  className="flex h-9 cursor-pointer items-center gap-3 rounded-lg px-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  key={option.value}
                >
                  <input
                    checked={isChecked}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-100"
                    onChange={() => onToggleField(option.value)}
                    type="checkbox"
                  />
                  <span>{option.label}</span>
                </label>
              );
            })}
          </div>

          {activeFilterCount > 0 ? (
            <button
              className="mt-3 h-8 w-full rounded-lg text-sm font-semibold text-blue-700 transition hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-100"
              onClick={onClear}
              type="button"
            >
              Limpar filtros
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

type RequestFiltersProps = {
  counts: Record<Exclude<FilterStatus, "ALL">, number>;
  currentFilter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
};

function RequestFilters({
  counts,
  currentFilter,
  onFilterChange,
}: RequestFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {filterOptions.map((filter) => {
        const isActive = filter.value === currentFilter;
        const count =
          filter.value === "ALL" ? null : (counts[filter.value] ?? 0);
        const label =
          count === null ? filter.label : `${filter.label} (${count})`;

        return (
          <button
            className={`h-9 rounded-lg px-4 text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-blue-100 ${
              isActive
                ? "bg-blue-600 text-white shadow-sm shadow-blue-600/20"
                : "bg-white text-slate-700 ring-1 ring-inset ring-slate-200 hover:text-blue-700 hover:ring-blue-200"
            }`}
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            type="button"
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

type RequestCardProps = {
  request: RequestListItem;
};

function RequestCard({ request }: RequestCardProps) {
  const status = normalizeStatus(request.status);
  const isPending = status === "PENDING";

  return (
    <article className="rounded-lg border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-bold tracking-normal text-slate-950">
              {request.userName}
            </h2>
            <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
              {request.department}
            </span>
            <RequestStatusBadge status={request.status} />
          </div>

          <p className="mt-2 text-sm font-medium text-slate-600">
            {request.vehicleModel} - {request.vehiclePlate}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
            <InfoItem icon={<CalendarIcon className="h-4 w-4" />}>
              {formatDateFromIso(request.startDate)}
            </InfoItem>
            <InfoItem icon={<ClockIcon className="h-4 w-4" />}>
              {formatTimeRangeFromIso(request.startDate, request.endDate)}
            </InfoItem>
            <InfoItem icon={<DestinationIcon className="h-4 w-4" />}>
              {`Destino: ${request.destination || "Não informado"}`}
            </InfoItem>
            <InfoItem icon={<PurposeIcon className="h-4 w-4" />}>
              {`Finalidade: ${request.reason}`}
            </InfoItem>
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-end gap-2">
          <Link
            aria-label={`Ver detalhes da solicitação de ${request.userName}`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
            href={`/requests/${request.id}`}
            title="Ver detalhes"
          >
            <EyeIcon className="h-4 w-4" />
          </Link>

          {isPending ? (
            <>
              <form action={approveRequestAction.bind(null, request.id)}>
                <button
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-100"
                  type="submit"
                >
                  <CheckIcon className="h-4 w-4" />
                  Aprovar
                </button>
              </form>
              <form action={rejectRequestAction.bind(null, request.id)}>
                <button
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-100"
                  type="submit"
                >
                  <XIcon className="h-4 w-4" />
                  Recusar
                </button>
              </form>
            </>
          ) : null}
        </div>
      </div>
    </article>
  );
}

type RequestStatusBadgeProps = {
  status: string;
};

function RequestStatusBadge({ status }: RequestStatusBadgeProps) {
  const normalizedStatus = normalizeStatus(status);
  const display = statusDisplay[normalizedStatus] ?? {
    className: "border-slate-200 bg-slate-100 text-slate-600",
    label: status,
  };

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${display.className}`}
      title={status}
    >
      {display.label}
    </span>
  );
}

type InfoItemProps = {
  children: string;
  icon: ReactNode;
};

function InfoItem({ children, icon }: InfoItemProps) {
  return (
    <span className="inline-flex min-w-0 items-center gap-1">
      <span className="shrink-0 text-slate-400">{icon}</span>
      <span className="truncate">{children}</span>
    </span>
  );
}

function normalizeStatus(status: string) {
  const normalized = normalizeText(status).toUpperCase();

  if (normalized === "PENDING") {
    return "PENDING";
  }

  if (normalized === "APPROVED" || normalized === "READY") {
    return "APPROVED";
  }

  if (normalized === "REJECTED") {
    return "REJECTED";
  }

  return "COMPLETED";
}

function getSearchableFields(
  request: RequestListItem,
  selectedFields: SearchField[],
) {
  if (selectedFields.length === 0) {
    return [
      request.userName,
      request.department,
      request.vehicleModel,
      request.vehiclePlate,
      request.destination,
      request.reason,
    ];
  }

  return selectedFields.map((field) => {
    if (field === "name") {
      return request.userName;
    }

    if (field === "plate") {
      return request.vehiclePlate;
    }

    return request.destination;
  });
}

function compareRequests(a: RequestListItem, b: RequestListItem) {
  const priorityA = statusPriority[normalizeStatus(a.status)] ?? 99;
  const priorityB = statusPriority[normalizeStatus(b.status)] ?? 99;

  if (priorityA !== priorityB) {
    return priorityA - priorityB;
  }

  return getRequestTimestamp(b) - getRequestTimestamp(a);
}

function getRequestTimestamp(request: RequestListItem) {
  const createdAtTimestamp = Date.parse(request.createdAt);

  if (!Number.isNaN(createdAtTimestamp)) {
    return createdAtTimestamp;
  }

  const startDateTimestamp = Date.parse(request.startDate);

  return Number.isNaN(startDateTimestamp) ? 0 : startDateTimestamp;
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLocaleLowerCase("pt-BR");
}

// Keep request schedule display in UTC-03 without depending on browser timezone.
const REQUEST_DISPLAY_UTC_OFFSET_MINUTES = -3 * 60;

type DateTimeParts = {
  day: string;
  hour: string | null;
  minute: string | null;
  month: string;
  year: string;
};

function formatDateFromIso(value?: string | null) {
  const parts = getDateTimePartsFromIso(value);

  if (!parts) {
    return "—";
  }

  return `${parts.day}/${parts.month}/${parts.year}`;
}

function formatTimeFromIso(value?: string | null) {
  const parts = getDateTimePartsFromIso(value);

  if (!parts?.hour || !parts.minute) {
    return "—";
  }

  return `${parts.hour}:${parts.minute}`;
}

function formatTimeRangeFromIso(start?: string | null, end?: string | null) {
  const startTime = formatTimeFromIso(start);
  const endTime = formatTimeFromIso(end);

  if (startTime === "—" || endTime === "—") {
    return "—";
  }

  return `${startTime} - ${endTime}`;
}

function getDateTimePartsFromIso(value?: string | null): DateTimeParts | null {
  if (!value) {
    return null;
  }

  if (!hasExplicitTimezone(value)) {
    return getDateTimePartsFromLocalIso(value);
  }

  const timestamp = Date.parse(value);

  if (Number.isNaN(timestamp)) {
    return getDateTimePartsFromLocalIso(value);
  }

  const shiftedDate = new Date(
    timestamp + REQUEST_DISPLAY_UTC_OFFSET_MINUTES * 60 * 1000,
  );

  return {
    day: padDatePart(shiftedDate.getUTCDate()),
    hour: padDatePart(shiftedDate.getUTCHours()),
    minute: padDatePart(shiftedDate.getUTCMinutes()),
    month: padDatePart(shiftedDate.getUTCMonth() + 1),
    year: String(shiftedDate.getUTCFullYear()),
  };
}

function getDateTimePartsFromLocalIso(value: string): DateTimeParts | null {
  const [datePart, timePart] = value.split("T");
  const [year, month, day] = datePart.split("-");

  if (!year || !month || !day) {
    return null;
  }

  const [hour, minute] = timePart?.split(":") ?? [];

  return {
    day: padDatePart(day),
    hour: hour ? padDatePart(hour) : null,
    minute: minute ? padDatePart(minute) : null,
    month: padDatePart(month),
    year,
  };
}

function hasExplicitTimezone(value: string) {
  return /(?:Z|[+-]\d{2}:?\d{2})$/i.test(value);
}

function padDatePart(value: number | string) {
  return String(value).padStart(2, "0");
}

type IconProps = {
  className?: string;
};

function SearchIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="m20 20-4.2-4.2M10.8 18a7.2 7.2 0 1 1 0-14.4 7.2 7.2 0 0 1 0 14.4Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function CalendarIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M7 4v3M17 4v3M5 9h14M6.5 20h11A1.5 1.5 0 0 0 19 18.5v-12A1.5 1.5 0 0 0 17.5 5h-11A1.5 1.5 0 0 0 5 6.5v12A1.5 1.5 0 0 0 6.5 20Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function ClockIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M12 7v5l3 2M20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function DestinationIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M12 21s6-5.1 6-10a6 6 0 1 0-12 0c0 4.9 6 10 6 10Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="11" r="2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function PurposeIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M7 4.5h10A1.5 1.5 0 0 1 18.5 6v12A1.5 1.5 0 0 1 17 19.5H7A1.5 1.5 0 0 1 5.5 18V6A1.5 1.5 0 0 1 7 4.5ZM8.5 8h7M8.5 12h7M8.5 16H13"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function CheckIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="m5 12 4 4 10-10"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function XIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="m7 7 10 10M17 7 7 17"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function EyeIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M3.8 12s2.8-5 8.2-5 8.2 5 8.2 5-2.8 5-8.2 5-8.2-5-8.2-5Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="2.4" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
