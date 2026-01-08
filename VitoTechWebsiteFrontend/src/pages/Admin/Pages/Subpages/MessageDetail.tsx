// src/pages/Admin/Pages/MessageDetail.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FiDownload, FiFile } from "react-icons/fi";
import { getNotification } from "../../../../lib/notifications";
import type { NotificationDto } from "../../../../lib/notifications";

function formatDate(dateString: string) {
  const d = new Date(dateString);
  return d.toLocaleString();
}

export default function MessageDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [message, setMessage] = useState<NotificationDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMessage = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await getNotification(Number(id));
        setMessage(data);
      } catch (err) {
        setError("Failed to load message details.");
        console.error("Error loading message:", err);
      } finally {
        setLoading(false);
      }
    };

    void loadMessage();
  }, [id]);

  const handleDownloadAttachment = () => {
    if (message?.attachment) {
      // Create a temporary link to download the file
      const link = document.createElement('a');
      link.href = message.attachment;
      link.download = message.attachment.split('/').pop() || 'attachment';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <p className="text-sm text-slate-500">Loading message details...</p>
      </div>
    );
  }

  if (error || !message) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Message not found
          </h1>
          <button
            type="button"
            onClick={() => navigate("/admin/messages")}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-indigo-400 hover:bg-indigo-50"
          >
            Back to messages
          </button>
        </div>
        <p className="text-sm text-slate-500">
          {error || "This message may have been deleted or is not available."}
        </p>
      </div>
    );
  }

  const isUnread = !message.is_read;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
            Message from {message.name}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Received on {formatDate(message.created_at)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/admin/messages"
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-indigo-400 hover:bg-indigo-50"
          >
            Back to messages
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Contact Info
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-900">
            {message.name}
          </p>
          <p className="mt-1 text-xs text-slate-600">{message.email}</p>
          {message.phone && (
            <p className="mt-1 text-xs text-slate-500">{message.phone}</p>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Company & Service
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-900">
            {message.company || "Not specified"}
          </p>
          <p className="mt-1 text-xs text-slate-600">
            {message.service || "No service selected"}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Status
          </p>
          <p className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
            <span
              className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                isUnread
                  ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                  : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
              }`}
            >
              {isUnread ? "Unread" : "Read"}
            </span>
          </p>
          <p className="mt-2 text-xs text-slate-500">ID: {message.id}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Attachment
          </p>
          <div className="mt-2">
            {message.attachment ? (
              <button
                onClick={handleDownloadAttachment}
                className="inline-flex items-center gap-2 rounded-md bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"
              >
                <FiDownload className="h-4 w-4" />
                Download File
              </button>
            ) : (
              <div className="flex items-center gap-2 text-slate-500">
                <FiFile className="h-4 w-4" />
                <span className="text-xs">No attachment</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 lg:col-span-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Message Content
          </p>
          <pre className="mt-3 whitespace-pre-wrap text-sm text-slate-900">
            {message.message}
          </pre>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Timestamps
            </p>
            <div className="mt-3 space-y-2 text-xs">
              <div>
                <p className="text-slate-500">Created:</p>
                <p className="text-slate-900">{formatDate(message.created_at)}</p>
              </div>
              <div>
                <p className="text-slate-500">Updated:</p>
                <p className="text-slate-900">{formatDate(message.updated_at)}</p>
              </div>
              {message.read_at && (
                <div>
                  <p className="text-slate-500">Read at:</p>
                  <p className="text-slate-900">{formatDate(message.read_at)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}