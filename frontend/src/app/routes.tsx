import { createBrowserRouter } from "react-router";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import TeacherLayout from "./layouts/TeacherLayout";
import AdminLayout from "./layouts/AdminLayout";
import TeacherDashboard from "./pages/teacher/Dashboard";
import TeacherUpload from "./pages/teacher/Upload";
import TeacherResult from "./pages/teacher/Result";
import TeacherHistory from "./pages/teacher/History";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminAddStudent from "./pages/admin/AddStudent";
import AdminTraining from "./pages/admin/Training";
import AdminHistory from "./pages/admin/History";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/signup",
    Component: Signup,
  },
  {
    path: "/teacher",
    Component: TeacherLayout,
    children: [
      {
        path: "dashboard",
        Component: TeacherDashboard,
      },
      {
        path: "upload",
        Component: TeacherUpload,
      },
      {
        path: "result",
        Component: TeacherResult,
      },
      {
        path: "history",
        Component: TeacherHistory,
      },
    ],
  },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      {
        path: "dashboard",
        Component: AdminDashboard,
      },
      {
        path: "add-student",
        Component: AdminAddStudent,
      },
      {
        path: "training",
        Component: AdminTraining,
      },
      {
        path: "history",
        Component: AdminHistory,
      },
    ],
  },
]);
