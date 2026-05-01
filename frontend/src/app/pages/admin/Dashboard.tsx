import { useNavigate } from 'react-router';

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl text-gray-800 mb-2">Welcome, Admin</h1>
        <p className="text-gray-600">Manage students and train the recognition model</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
        <button
          onClick={() => navigate('/admin/add-student')}
          className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow text-left"
        >
          <div className="text-4xl mb-4">👤</div>
          <h3 className="text-xl mb-2 text-gray-800">Add Student</h3>
          <p className="text-gray-600">Register new students with photos</p>
        </button>

        <button
          onClick={() => navigate('/admin/training')}
          className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow text-left"
        >
          <div className="text-4xl mb-4">🧠</div>
          <h3 className="text-xl mb-2 text-gray-800">Train Model</h3>
          <p className="text-gray-600">Train face recognition model</p>
        </button>

        <button
          onClick={() => navigate('/admin/history')}
          className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow text-left"
        >
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-xl mb-2 text-gray-800">View History</h3>
          <p className="text-gray-600">Access all attendance records</p>
        </button>
      </div>
    </div>
  );
}
