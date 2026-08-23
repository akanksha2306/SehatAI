import React from "react";
import { createBrowserRouter, Outlet } from "react-router";
import { SignIn } from "./pages/sign-in";
import { Verify } from "./pages/verify";
import { Onboarding } from "./pages/onboarding";
import { Dashboard } from "./pages/dashboard";
import { Course } from "./pages/course";
import { Scribe } from "./pages/scribe";
import { Workflow } from "./pages/workflow";
import { ProtectedRoute } from "./components/protected-route";

function Layout(): React.ReactElement {
  return <Outlet />;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <SignIn />,
      },
      {
        path: "/auth/verify",
        element: <Verify />,
      },
      {
        path: "/onboarding",
        element: (
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/courses/:track",
        element: (
          <ProtectedRoute>
            <Course />
          </ProtectedRoute>
        ),
      },
      {
        path: "/scribe",
        element: (
          <ProtectedRoute>
            <Scribe />
          </ProtectedRoute>
        ),
      },
      {
        path: "/workflow",
        element: (
          <ProtectedRoute>
            <Workflow />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
