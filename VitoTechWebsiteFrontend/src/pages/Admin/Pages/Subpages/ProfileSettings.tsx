// src/pages/Admin/Pages/Subpages/ProfileSettings.tsx
import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { authedRequest } from "../../../../lib/api";

interface ApiErrorResponseBody {
  detail?: string;
}

interface ApiError {
  responseBody?: ApiErrorResponseBody;
}

export default function ProfileSettings() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      await authedRequest("/api/auth/change-username/", {
        method: "POST",
        body: JSON.stringify({ username }),
      });

      setSuccess(true);
      localStorage.setItem("vt_admin_username", username);

      setTimeout(() => {
        navigate("/admin");
      }, 2000);
    } catch (error: unknown) {
      const err = error as ApiError;
      setError(
        err.responseBody?.detail ?? "Failed to update username.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Profile Settings
        </h1>
        <p className="mt-1 text-sm text-slate-500">Update your username</p>
      </div>

      <div className="max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-slate-700"
            >
              New Username
            </label>
            <input
              id="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          {error && (
            <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
              Username updated successfully! Redirecting...
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {submitting ? "Updating..." : "Update Username"}
          </button>
        </form>
      </div>
    </div>
  );
}
