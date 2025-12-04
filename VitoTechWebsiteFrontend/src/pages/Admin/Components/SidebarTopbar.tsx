// src/pages/Admin/Components/SidebarTopbar.tsx
import { useCallback, useEffect, useState, useRef } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FiLayout,
  FiMail,
  FiRefreshCw,
  FiLogOut,
  FiMenu,
  FiX,
  FiUser,
  FiLock,
  FiChevronDown,
  FiUserPlus,
} from "react-icons/fi";
import {
  getNotifications,
  markNotificationRead,
  markNotificationUnread,
  getNotificationStats,
} from "../../../lib/notifications";
import { clearAdminToken } from "../../../lib/api";

export type MessageStatus = "read" | "unread";

export type ContactMessage = {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  message: string;
  attachment: string | null;
  status: MessageStatus;
  createdAt: string;
};

export type MessagesOutletContext = {
  messages: ContactMessage[];
  total: number;
  unread: number;
  read: number;
  loading: boolean;
  error: string | null;
  refresh: () => void;
  handleToggleStatus: (id: number) => void;
  handleMarkAllRead: () => void;
};

export default function SidebarTopbar() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [adminName, setAdminName] = useState<string | null>(null);
  const [stats, setStats] = useState({ total: 0, unread: 0, read: 0 });

  useEffect(() => {
    const storedName = localStorage.getItem("vt_admin_username");
    if (storedName) {
      setAdminName(storedName);
    }
  }, []);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
      if (
        profileDropdownRef.current &&

        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [apiMessages, statsData] = await Promise.all([
        getNotifications(),
        getNotificationStats(),
      ]);

      const mapped: ContactMessage[] = apiMessages.map((n) => ({
        id: n.id,
        name: n.name,
        email: n.email,
        phone: n.phone,
        company: n.company,
        service: n.service,
        message: n.message,
        attachment: n.attachment,
        status: n.is_read ? "read" : "unread",
        createdAt: n.created_at,
      }));

      setMessages(mapped);
      setStats(statsData);
    } catch {
      setError("Failed to load messages. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadNotifications();
  }, [loadNotifications]);

  const handleToggleStatus = (id: number) => {
    void (async () => {
      const target = messages.find((m) => m.id === id);
      if (!target) return;

      const nextStatus: MessageStatus =
        target.status === "unread" ? "read" : "unread";

      try {
        if (nextStatus === "read") {
          await markNotificationRead(id);
        } else {
          await markNotificationUnread(id);
        }

        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, status: nextStatus } : m)),
        );

        setStats((prev) => ({
          ...prev,
          unread: nextStatus === "read" ? prev.unread - 1 : prev.unread + 1,
          read: nextStatus === "read" ? prev.read + 1 : prev.read - 1,
        }));
      } catch {
        setError("Failed to update the message status. Please try again.");
      }
    })();
  };

  const handleMarkAllRead = () => {
    void (async () => {
      const unreadIds = messages
        .filter((m) => m.status === "unread")
        .map((m) => m.id);

      if (unreadIds.length === 0) return;

      try {
        await Promise.all(unreadIds.map((id) => markNotificationRead(id)));

        setMessages((prev) =>
          prev.map((m) =>
            unreadIds.includes(m.id) ? { ...m, status: "read" } : m,
          ),
        );

        setStats((prev) => ({
          ...prev,
          unread: 0,
          read: prev.total,
        }));
      } catch {
        setError("Failed to mark all messages as read. Please try again.");
      }
    })();
  };

  const handleLogout = () => {
    clearAdminToken();
    localStorage.removeItem("vt_admin_username");
    localStorage.removeItem("vt_admin_refresh");

    window.history.replaceState(null, "", "/login");

    navigate("/login", {
      replace: true,
      state: { timestamp: Date.now() },
    });
  };

  const handleChangePassword = () => {
    navigate("/admin/change-password");
    setDropdownOpen(false);
    setProfileDropdownOpen(false);
    setSidebarOpen(false);
  };

  const handleProfileSettings = () => {
    navigate("/admin/profile");
    setDropdownOpen(false);
    setProfileDropdownOpen(false);
    setSidebarOpen(false);
  };

  const handleCreateAdmin = () => {
    navigate("/admin/users/create");
    setDropdownOpen(false);
    setProfileDropdownOpen(false);
    setSidebarOpen(false);
  };

  const outletContext: MessagesOutletContext = {
    messages,
    total: stats.total,
    unread: stats.unread,
    read: stats.read,
    loading,
    error,
    refresh: () => {
      void loadNotifications();
    },
    handleToggleStatus,
    handleMarkAllRead,
  };

  const initials =
    adminName
      ?.split(" ")
      .filter(Boolean)
      .map((part) => part[0]?.toUpperCase())
      .slice(0, 2)
      .join("") || "AD";

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen flex-col">
        {/* TOP BAR */}
        <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-md p-2 text-slate-500 hover:bg-slate-100 md:hidden"
            >
              {sidebarOpen ? (
                <FiX className="h-5 w-5" />
              ) : (
                <FiMenu className="h-5 w-5" />
              )}
            </button>

            <div className="flex items-center gap-4">
              <img
                src="/images/vt4-1.png"
                alt="VitoTech logo"
                className="h-8 w-auto"
              />

              <div className="h-6 border-r border-slate-300" />

              <div className="hidden sm:block">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                  VITOTECH
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  Admin Panel
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden text-[11px] text-slate-600 md:flex md:items-center md:gap-4">
              <span>Total: {stats.total}</span>
              <span>Unread: {stats.unread}</span>
              <span>Read: {stats.read}</span>
            </div>

            <button
              type="button"
              onClick={() => {
                void loadNotifications();
              }}
              className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-700 hover:border-indigo-400 hover:bg-indigo-50 transition-colors"
            >
              <FiRefreshCw className="h-3 w-3" />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            {/* Desktop Admin Dropdown */}
            <div className="relative hidden sm:block" ref={profileDropdownRef}>
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-[11px] font-semibold uppercase tracking-wide text-white">
                  {initials}
                </div>
                <div className="text-left text-[11px]">
                  <p className="font-semibold text-slate-800">
                    {adminName || "Admin"}
                  </p>
                  <p className="text-[10px] text-slate-500">Administrator</p>
                </div>
                <FiChevronDown
                  className={`h-4 w-4 text-slate-400 transition-transform ${
                    profileDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 z-50 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <div className="border-b border-slate-100 px-4 py-2">
                      <p className="text-sm font-medium text-slate-900">
                        {adminName || "Admin"}
                      </p>
                      <p className="text-xs text-slate-500">Administrator</p>
                    </div>

                    <button
                      onClick={handleProfileSettings}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <FiUser className="h-4 w-4" />
                      <span>Profile Settings</span>
                    </button>

                    <button
                      onClick={handleChangePassword}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <FiLock className="h-4 w-4" />
                      <span>Change Password</span>
                    </button>

                    <button
                      onClick={handleCreateAdmin}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <FiUserPlus className="h-4 w-4" />
                      <span>Create New Admin</span>
                    </button>

                    <div className="my-1 border-t border-slate-100" />

                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-rose-700 hover:bg-rose-50 transition-colors"
                    >
                      <FiLogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Admin Dropdown */}
            <div className="relative sm:hidden" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-[11px] font-semibold uppercase tracking-wide text-white hover:bg-indigo-600 transition-colors"
              >
                {initials}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 z-50 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <div className="border-b border-slate-100 px-4 py-2">
                      <p className="text-sm font-medium text-slate-900">
                        {adminName || "Admin"}
                      </p>
                      <p className="text-xs text-slate-500">Administrator</p>
                    </div>

                    <button
                      onClick={handleProfileSettings}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <FiUser className="h-4 w-4" />
                      <span>Profile Settings</span>
                    </button>

                    <button
                      onClick={handleChangePassword}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <FiLock className="h-4 w-4" />
                      <span>Change Password</span>
                    </button>

                    <button
                      onClick={handleCreateAdmin}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <FiUserPlus className="h-4 w-4" />
                      <span>Create New Admin</span>
                    </button>

                    <div className="my-1 border-t border-slate-100" />

                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-rose-700 hover:bg-rose-50 transition-colors"
                    >
                      <FiLogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Mobile Stats Bar */}
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-2 md:hidden">
          <div className="flex justify-between text-[11px] text-slate-600">
            <span>Total: {stats.total}</span>
            <span>Unread: {stats.unread}</span>
            <span>Read: {stats.read}</span>
          </div>
        </div>

        {/* BODY */}
        <div className="flex flex-1">
          {/* SIDEBAR */}
          <div
            className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-slate-200 bg-white pt-4 transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:z-auto ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {/* Close button for mobile sidebar */}
            <div className="flex items-center justify-between px-4 pb-4 md:hidden">
              <div className="flex items-center gap-3">
                <img
                  src="/images/vt4-1.png"
                  alt="VitoTech logo"
                  className="h-6 w-auto"
                />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                    VITOTECH
                  </p>
                  <p className="text-xs font-semibold text-slate-900">
                    Admin Panel
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="rounded-md p-1 text-slate-500 hover:bg-slate-100"
              >
                <FiX className="h-4 w-4" />
              </button>
            </div>

            <nav className="space-y-1 px-3 text-sm">
              <NavLink
                to="/admin"
                end
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 font-medium transition ${
                    isActive
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-600 hover:bg-slate-50"
                  }`
                }
              >
                <FiLayout className="h-4 w-4" />
                <span>Dashboard</span>
              </NavLink>

              <NavLink
                to="/admin/messages"
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 font-medium transition ${
                    isActive
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-600 hover:bg-slate-50"
                  }`
                }
              >
                <FiMail className="h-4 w-4" />
                <span>Messages</span>
                {stats.unread > 0 && (
                  <span className="ml-auto rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 ring-1 ring-amber-200">
                    {stats.unread}
                  </span>
                )}
              </NavLink>
            </nav>
          </div>

          {sidebarOpen && (
            <div
              className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <main className="flex-1 bg-slate-100 px-4 py-6 sm:px-6 lg:px-8">
            {error && (
              <div className="mb-4 rounded-md border border-rose-200 bg-rose-50 px-4 py-2 text-xs text-rose-700">
                {error}
              </div>
            )}
            <Outlet context={outletContext} />
          </main>
        </div>
      </div>
    </div>
  );
}
