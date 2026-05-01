import { Link, useNavigate } from "react-router";

interface SidebarProps {
  role: 'teacher' | 'admin';
}

export default function Sidebar({ role }: SidebarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  const teacherLinks = [
    { path: '/teacher/dashboard', label: 'Dashboard' },
    { path: '/teacher/upload', label: 'Upload Attendance' },
    { path: '/teacher/history', label: 'History' },
  ];

  const adminLinks = [
    { path: '/admin/dashboard', label: 'Dashboard' },
    { path: '/admin/add-student', label: 'Add Student' },
    { path: '/admin/training', label: 'Train Model' },
    { path: '/admin/history', label: 'Attendance History' },
  ];

  const links = role === 'teacher' ? teacherLinks : adminLinks;

  return (
    <div className="w-64 bg-white shadow-lg h-screen flex flex-col">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold text-gray-800">
          {role === 'teacher' ? 'Teacher Portal' : 'Admin Portal'}
        </h2>
      </div>

      <nav className="flex-1 p-4">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className="block px-4 py-3 mb-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
