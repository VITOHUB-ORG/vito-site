// src/pages/Admin/Pages/Messages.tsx
import { useOutletContext, Link } from "react-router-dom";
import { FiCheckCircle, FiMail, FiPhone, FiCalendar } from "react-icons/fi";
import type { MessagesOutletContext } from "../Components/SidebarTopbar";

function useMessagesContext() {
  return useOutletContext<MessagesOutletContext>();
}

function formatDate(dateString: string) {
  const d = new Date(dateString);
  return d.toLocaleString();
}

function formatDateShort(dateString: string) {
  const d = new Date(dateString);
  return d.toLocaleDateString();
}

export default function Messages() {
  const {
    messages,
    loading,
    handleToggleStatus,
    handleMarkAllRead,
  } = useMessagesContext();

  return (
    <div className="flex h-full flex-col">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
            Messages
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            List of all messages submitted through your website contact forms.
          </p>
        </div>

        {messages.length > 0 && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="inline-flex items-center gap-2 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700 hover:bg-emerald-100 transition-colors"
          >
            <FiCheckCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Mark all as read</span>
            <span className="sm:hidden">Mark all read</span>
          </button>
        )}
      </div>

      <div className="flex-1 overflow-hidden rounded-xl border border-slate-200 bg-white">
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <p className="text-sm text-slate-500">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-40 items-center justify-center">
            <p className="text-sm text-slate-500">
              No messages yet. They will appear here once someone submits a
              contact form.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block max-h-[540px] overflow-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="sticky top-0 bg-slate-100 text-xs uppercase tracking-[0.14em] text-slate-500">
                  <tr>
                    <th className="px-4 py-3">From</th>
                    <th className="px-4 py-3">Contact</th>
                    <th className="px-4 py-3">Message</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {messages.map((msg) => (
                    <tr key={msg.id} className="align-top hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-slate-900">
                        <div className="font-semibold">{msg.name}</div>
                        {msg.company && (
                          <div className="mt-1 text-xs text-slate-500">
                            {msg.company}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">
                        <div className="flex items-center gap-1">
                          <FiMail className="h-3 w-3" />
                          {msg.email}
                        </div>
                        {msg.phone && (
                          <div className="mt-1 flex items-center gap-1 text-slate-500">
                            <FiPhone className="h-3 w-3" />
                            {msg.phone}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-800">
                        <p className="line-clamp-3">{msg.message}</p>
                        {msg.service && (
                          <div className="mt-1">
                            <span className="inline-block rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700 ring-1 ring-blue-200">
                              {msg.service}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            msg.status === "unread"
                              ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                              : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                          }`}
                        >
                          {msg.status === "unread" ? "Unread" : "Read"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">
                        {formatDate(msg.createdAt)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Link
                            to={`/admin/messages/${msg.id}`}
                            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-indigo-400 hover:bg-indigo-50"
                          >
                            View
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(msg.id)}
                            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-indigo-400 hover:bg-indigo-50"
                          >
                            {msg.status === "unread"
                              ? "Mark read"
                              : "Mark unread"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-slate-200">
              {messages.map((msg) => (
                <div key={msg.id} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900">{msg.name}</h3>
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${
                            msg.status === "unread"
                              ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                              : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                          }`}
                        >
                          {msg.status === "unread" ? "Unread" : "Read"}
                        </span>
                      </div>
                      
                      {msg.company && (
                        <p className="text-xs text-slate-500 mt-1">{msg.company}</p>
                      )}
                      
                      <div className="mt-2 text-xs text-slate-600">
                        <div className="flex items-center gap-1">
                          <FiMail className="h-3 w-3" />
                          {msg.email}
                        </div>
                        {msg.phone && (
                          <div className="flex items-center gap-1 mt-1">
                            <FiPhone className="h-3 w-3" />
                            {msg.phone}
                          </div>
                        )}
                      </div>

                      <div className="mt-2">
                        <p className="text-sm text-slate-800 line-clamp-2">
                          {msg.message}
                        </p>
                      </div>

                      {msg.service && (
                        <div className="mt-2">
                          <span className="inline-block rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700 ring-1 ring-blue-200">
                            {msg.service}
                          </span>
                        </div>
                      )}

                      <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                        <FiCalendar className="h-3 w-3" />
                        {formatDateShort(msg.createdAt)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <Link
                      to={`/admin/messages/${msg.id}`}
                      className="flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-center text-xs font-semibold text-slate-700 transition hover:border-indigo-400 hover:bg-indigo-50"
                    >
                      View Details
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(msg.id)}
                      className="flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-indigo-400 hover:bg-indigo-50"
                    >
                      {msg.status === "unread" ? "Mark Read" : "Mark Unread"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}