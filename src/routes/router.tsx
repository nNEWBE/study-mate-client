
import { createBrowserRouter } from "react-router-dom";
import Main from "../pages/Main";
import Home from "../pages/Home";
import Account from "../pages/Account";
import ScrollToTop from "../lib/ScrollToTop";
import Error from "../pages/Error";
import Tasks from "../pages/Tasks";
import CreateAssignments from "../pages/CreateAssignments";
import PrivateRoute from "./PrivateRoute";
import RoleBasedRoute from "./RoleBasedRoute";
import UpdateAssignment from "../pages/UpdateAssignment";
import ViewDetails from "../pages/ViewDetails";
import Contact from "../pages/Contact";
import About from "../pages/About";
import Wishlist from "../pages/Wishlist";

// Dashboard Imports
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardOverview from "../pages/dashboard/DashboardOverview";
import DashboardSubmissions from "../pages/dashboard/DashboardSubmissions";
import DashboardRole from "../pages/dashboard/DashboardRole";
import DashboardProfile from "../pages/dashboard/DashboardProfile";
import DashboardSettings from "../pages/dashboard/DashboardSettings";
import DashboardAnalytics from "../pages/dashboard/DashboardAnalytics";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <ScrollToTop />
        <Main />
      </>
    ),
    errorElement: <Error></Error>,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/account",
        element: <Account />,
      },
      {
        path: "/tasks",
        element: <Tasks />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/create",
        element: (
          <PrivateRoute>
            <CreateAssignments />
          </PrivateRoute>
        ),
      },
      {
        path: "/wishlist",
        element: (
          <PrivateRoute>
            <Wishlist />
          </PrivateRoute>
        ),
      },
      {
        path: "/update/:id",
        element: (
          <PrivateRoute>
            <UpdateAssignment />
          </PrivateRoute>
        ),
        loader: ({ params }) =>
          fetch(`${import.meta.env.VITE_API_URL}/assignment/${params.id}`),
      },
      {
        path: "tasks/update/:id",
        element: (
          <PrivateRoute>
            <UpdateAssignment />
          </PrivateRoute>
        ),
        loader: ({ params }) =>
          fetch(`${import.meta.env.VITE_API_URL}/assignment/${params.id}`),
      },
      {
        path: "assignment/:id",
        element: (
          <PrivateRoute>
            <ViewDetails />
          </PrivateRoute>
        ),
        loader: ({ params }) =>
          fetch(`${import.meta.env.VITE_API_URL}/assignment/${params.id}`),
      },
      {
        path: "tasks/assignment/:id",
        element: (
          <PrivateRoute>
            <ViewDetails />
          </PrivateRoute>
        ),
        loader: ({ params }) =>
          fetch(`${import.meta.env.VITE_API_URL}/assignment/${params.id}`),
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <RoleBasedRoute allowedRoles={['student', 'teacher', 'admin']}>
        <DashboardLayout />
      </RoleBasedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardOverview />
      },
      {
        path: "analytics",
        element: <DashboardAnalytics />
      },
      {
        path: "submissions",
        element: <DashboardSubmissions />
      },
      {
        path: "profile",
        element: <DashboardProfile />
      },
      {
        path: "settings",
        element: <DashboardSettings />
      },
      {
        path: "role-request",
        element: <DashboardRole />
      }
    ]
  }
]);

export default router;

