import { useState } from 'react';
import { useNavigate } from 'react-router';

export default function TeacherUpload() {
  const [video, setVideo] = useState<File | null>(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [subject, setSubject] = useState('');
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!video) return;
    
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('video', video);
      formData.append('subject', subject);
      formData.append('startTime', startTime);
      formData.append('endTime', endTime);
      formData.append('date', new Date().toLocaleDateString());

      const { default: api } = await import('../../api');
      const { data } = await api.post('/teacher/attendance/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      alert(data.message);
      // Pass the sessionId to result page
      sessionStorage.setItem('attendanceSessionId', data.sessionId);
      navigate('/teacher/result');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Upload failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl text-gray-800 mb-2">Upload Attendance</h1>
        <p className="text-gray-600">Upload video and configure settings</p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-700 mb-2">Video Upload</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideo(e.target.files?.[0] || null)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter subject name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            Process Attendance
          </button>
        </form>
      </div>
    </div>
  );
}
