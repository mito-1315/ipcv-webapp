import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import api from '../api';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'teacher' | 'admin'>('teacher');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const { data } = await api.post('/auth/signup', { name, email, password, role });
      localStorage.setItem('userInfo', JSON.stringify(data));
      if (data.role === 'teacher') {
        navigate('/teacher/dashboard');
      } else {
        navigate('/admin/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl mb-2 text-gray-800">Smart Attendance Portal</h1>
          <p className="text-gray-500">Create a new account</p>
        </div>

        {error && <div className="mb-4 text-red-500 text-center text-sm">{error}</div>}

        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Create a password"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Role</label>
            <div className="flex gap-4">
              <label className="flex items-center flex-1">
                <input
                  type="radio"
                  value="teacher"
                  checked={role === 'teacher'}
                  onChange={() => setRole('teacher')}
                  className="mr-2"
                />
                <span className="text-gray-700">Teacher</span>
              </label>
              <label className="flex items-center flex-1">
                <input
                  type="radio"
                  value="admin"
                  checked={role === 'admin'}
                  onChange={() => setRole('admin')}
                  className="mr-2"
                />
                <span className="text-gray-700">Admin</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 text-white rounded-lg transition-colors shadow-md ${
              isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}
