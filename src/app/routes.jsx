import { createBrowserRouter, Navigate } from "react-router";
import { Layout } from "./layout/Layout";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { Documents } from "./pages/Documents";
import { Analytics } from "./pages/Analytics";
import { Settings } from "./pages/Settings";
import { AdminPanel } from "./pages/AdminPanel";
import { AuditLogs } from "./pages/AuditLogs";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/auth/login",
    element: <Login />,
  },
  {
    path: "/auth/register",
    element: <Register />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "documents", element: <Documents /> },
      { path: "analytics", element: <Analytics /> },
      { path: "audit-logs", element: <AuditLogs /> },
      { path: "settings", element: <Settings /> },
      { path: "admin", element: <AdminPanel /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
