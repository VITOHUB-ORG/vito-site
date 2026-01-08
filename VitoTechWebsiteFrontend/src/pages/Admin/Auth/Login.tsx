// src/pages/Admin/Auth/Login.tsx
import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { login, getAccessToken } from "../../../lib/auth";
import type { ApiError } from "../../../lib/api";

type LocationState = {
  from?: { pathname: string };
};

function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof (error as { status: unknown }).status === "number"
  );
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prevent access if already logged in
  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      navigate("/admin", { replace: true });
    }
  }, [navigate]);

  // Prevent back navigation after logout
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function() {
      window.history.go(1);
    };

    return () => {
      window.onpopstate = null;
    };
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await login(username, password);

      // Store admin name for the top bar
      localStorage.setItem("vt_admin_username", username);

      const target = state?.from?.pathname ?? "/admin";
      navigate(target, { replace: true });
    } catch (err: unknown) {
      if (isApiError(err) && err.status === 401) {
        setError("The username or password is incorrect.");
      } else {
        setError("We could not log you in right now. Please try again in a moment.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 text-slate-900">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white px-6 py-8 shadow-lg shadow-slate-200/70">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <img
            src="/images/vt4-1.png"
            alt="VitoTech"
            className="h-10 w-auto"
          />
        </div>

        <h1 className="text-center text-lg font-semibold tracking-tight text-slate-900">
          VitoTech Admin Login
        </h1>

        <form
          className="mt-6 space-y-5"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <div>
            <label
              htmlFor="login-username"
              className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500"
            >
              Username
            </label>
            <input
              id="login-username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              spellCheck={false}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none ring-0 transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500"
            >
              Password
            </label>
            <input
              id="login-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none ring-0 transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <p className="text-xs font-semibold text-rose-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-indigo-500 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-white shadow-md shadow-indigo-300 transition hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}