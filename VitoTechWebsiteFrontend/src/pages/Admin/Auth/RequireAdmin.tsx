// src/pages/Admin/Auth/RequireAdmin.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getAccessToken } from "../../../lib/auth";
import { useEffect, useState } from "react";

export default function RequireAdmin() {
  const location = useLocation();
  const [timestamp] = useState(() => Date.now());
  const token = getAccessToken();

  // Clear any cached data when component mounts
  useEffect(() => {
    // Prevent back button navigation after logout
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
      window.history.go(1);
    };

    return () => {
      window.onpopstate = null;
    };
  }, []);

  if (!token) {
    // Clear any remaining admin data to ensure clean state
    localStorage.removeItem("vt_admin_username");
    localStorage.removeItem("vt_admin_refresh");
    
    return (
      <Navigate
        to="/login"
        replace
        state={{ 
          from: location,
          // Add timestamp to prevent caching
          timestamp: timestamp
        }}
      />
    );
  }

  return <Outlet />;
}