import { useNavigate } from 'react-router';

export default function TeacherDashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl text-gray-800 mb-2">Welcome, Teacher</h1>
        <p className="text-gray-600">Manage your attendance and view history</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        <button
          onClick={() => navigate('/teacher/upload')}
          className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow text-left"
        >
          <div className="text-4xl mb-4">🎥</div>
          <h3 className="text-xl mb-2 text-gray-800">Take Attendance</h3>
          <p className="text-gray-600">Upload video and process attendance</p>
        </button>

        <button
          onClick={() => navigate('/teacher/history')}
          className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow text-left"
        >
          <div className="text-4xl mb-4">📋</div>
          <h3 className="text-xl mb-2 text-gray-800">View History</h3>
          <p className="text-gray-600">Access past attendance records</p>
        </button>
      </div>
    </div>
  );
}
