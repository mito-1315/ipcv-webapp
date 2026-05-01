import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar";

export default function TeacherLayout() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar role="teacher" />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
