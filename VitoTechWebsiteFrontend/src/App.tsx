// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Admin/Auth/Login";
import RequireAdmin from "./pages/Admin/Auth/RequireAdmin";
import SidebarTopbar from "./pages/Admin/Components/SidebarTopbar";
import Dashboard from "./pages/Admin/Pages/Dashboard";
import Messages from "./pages/Admin/Pages/Messages";
import MessageDetail from "./pages/Admin/Pages/Subpages/MessageDetail";
import ProfileSettings from "./pages/Admin/Pages/Subpages/ProfileSettings";
import ChangePassword from "./pages/Admin/Pages/Subpages/ChangePassword";
import CreateAdminUser from "./pages/Admin/Pages/Subpages/CreateAdminUser";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Admin Routes */}
        <Route element={<RequireAdmin />}>
          <Route path="/admin" element={<SidebarTopbar />}>
            <Route index element={<Dashboard />} />
            <Route path="messages" element={<Messages />} />
            <Route path="messages/:id" element={<MessageDetail />} />
            <Route path="profile" element={<ProfileSettings />} />
            <Route path="change-password" element={<ChangePassword />} />
            <Route path="users/create" element={<CreateAdminUser />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
