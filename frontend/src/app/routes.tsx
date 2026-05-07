import { createBrowserRouter } from "react-router";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { SearchPage } from "./pages/SearchPage";
import { FreelancerProfilePage } from "./pages/FreelancerProfilePage";
import { UnifiedDashboard } from "./pages/UnifiedDashboard";
import { CreateServicePage } from "./pages/CreateServicePage";
import { MessagesPage } from "./pages/MessagesPage";
import { AdminPage } from "./pages/AdminPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/register",
    Component: RegisterPage,
  },
  {
    path: "/search",
    Component: SearchPage,
  },
  {
    path: "/freelancer/:id",
    Component: FreelancerProfilePage,
  },
  {
    path: "/dashboard",
    Component: UnifiedDashboard,
  },
  {
    path: "/service/create",
    Component: CreateServicePage,
  },
  {
    path: "/service/edit/:id",
    Component: CreateServicePage,
  },
  {
    path: "/messages",
    Component: MessagesPage,
  },
  {
    path: "/admin",
    Component: AdminPage,
  },
  {
    path: "*",
    Component: NotFoundPage,
  },
]);