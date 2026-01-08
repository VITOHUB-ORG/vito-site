// src/pages/Admin/Pages/Dashboard.tsx
import { useOutletContext } from "react-router-dom";
import type { MessagesOutletContext } from "../Components/SidebarTopbar";

function useMessagesContext() {
  return useOutletContext<MessagesOutletContext>();
}

function formatDate(dateString: string) {
  const d = new Date(dateString);
  return d.toLocaleString();
}

export default function Dashboard() {
  const { total, unread, read, messages, loading } = useMessagesContext();
  const latest = messages.slice(0, 5);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Overview of all messages submitted from your website.
        </p>
      </div>

      {/* Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Total Messages
          </p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">
            {total}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Total number of messages received.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-600">
            Unread
          </p>
          <p className="mt-3 text-3xl font-semibold text-amber-600">
            {unread}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Messages that are still waiting to be reviewed.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-600">
            Read
          </p>
          <p className="mt-3 text-3xl font-semibold text-emerald-600">
            {read}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Messages that have already been opened.
          </p>
        </div>
      </div>

      {/* Latest messages */}
      <div className="mt-8">
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Latest Messages
        </h2>

        {loading ? (
          <p className="mt-3 text-sm text-slate-500">
            Loading messages...
          </p>
        ) : latest.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">
            You haven’t received any messages yet.
          </p>
        ) : (
          <div className="mt-3 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
            {latest.map((msg) => (
              <div
                key={msg.id}
                className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-start sm:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {msg.name}
                  </p>
                  <p className="text-xs text-slate-500">{msg.email}</p>
                  {msg.phone && (
                    <p className="text-xs text-slate-500">{msg.phone}</p>
                  )}
                  <p className="mt-2 line-clamp-2 text-sm text-slate-700">
                    {msg.message}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 text-right">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      msg.status === "unread"
                        ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                        : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                    }`}
                  >
                    {msg.status === "unread" ? "Unread" : "Read"}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {formatDate(msg.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
