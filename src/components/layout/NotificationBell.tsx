type NotificationBellProps = {
  className?: string;
};

export function NotificationBell({ className = "" }: NotificationBellProps) {
  return (
    <button
      aria-label="Notificações"
      className={`relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-blue-200 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 ${className}`}
      title="Notificações"
      type="button"
    >
      <BellIcon className="h-5 w-5" />
      <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />
    </button>
  );
}

type IconProps = {
  className?: string;
};

function BellIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M18 10.8V9a6 6 0 1 0-12 0v1.8c0 1.1-.3 2.1-.9 3L4 15.5h16l-1.1-1.7a5.7 5.7 0 0 1-.9-3ZM9.8 18.5a2.4 2.4 0 0 0 4.4 0"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}
