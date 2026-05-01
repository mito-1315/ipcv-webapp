import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import AttendanceList from '../../components/AttendanceList';

interface Student {
  id: string;
  name: string;
  rollNo: string;
  email: string;
  department: string;
  year: string;
  section: string;
  image?: string;
}

export default function TeacherResult() {
  const navigate = useNavigate();
  const [attendanceData, setAttendanceData] = useState<any>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [status, setStatus] = useState<string>('processing');

  useEffect(() => {
    const sessionId = sessionStorage.getItem('attendanceSessionId');
    if (!sessionId) return;

    let pollInterval: any;

    const fetchSession = async () => {
      try {
        const { default: api } = await import('../../api');
        const { data } = await api.get(`/teacher/attendance/${sessionId}`);
        
        setAttendanceData(data.session);
        setStatus(data.session.status);

        if (data.session.status === 'completed') {
          setStudents(data.students);
          clearInterval(pollInterval);
        } else if (data.session.status === 'failed') {
          clearInterval(pollInterval);
        }
      } catch (error) {
        console.error('Failed to fetch session', error);
      }
    };

    fetchSession();
    pollInterval = setInterval(fetchSession, 5000);

    return () => clearInterval(pollInterval);
  }, []);

  const handleUpdateStudent = (index: number, updatedStudent: Student) => {
    const newStudents = [...students];
    newStudents[index] = updatedStudent;
    setStudents(newStudents);
  };

  const handleSave = () => {
    alert('Attendance saved successfully!');
    navigate('/teacher/dashboard');
  };

  const handleExport = () => {
    const csv = [
      ['Name', 'Roll No', 'Email', 'Department', 'Year', 'Section'],
      ...students.map(s => [s.name, s.rollNo, s.email, s.department, s.year, s.section])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attendance.csv';
    a.click();
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl text-gray-800 mb-2">Attendance Result</h1>
        {attendanceData && (
          <div className="text-gray-600">
            <p>Subject: {attendanceData.subject}</p>
            <p>Date: {attendanceData.date} | {attendanceData.startTime} - {attendanceData.endTime}</p>
            <p>Status: <span className="font-bold uppercase">{status}</span></p>
          </div>
        )}
      </div>

      {status === 'processing' && (
        <div className="text-center p-12 bg-white rounded-xl shadow-md">
          <div className="animate-spin text-4xl mb-4">🔄</div>
          <h2 className="text-xl text-gray-800 mb-2">Processing Video...</h2>
          <p className="text-gray-600">Please wait while the face recognition model identifies students.</p>
        </div>
      )}

      {status === 'failed' && (
        <div className="text-center p-12 bg-red-50 rounded-xl shadow-md border border-red-200">
          <div className="text-4xl mb-4">❌</div>
          <h2 className="text-xl text-red-800 mb-2">Processing Failed</h2>
          <p className="text-red-600">There was an error processing the video.</p>
        </div>
      )}

      {status === 'completed' && (
        <>
          <div className="mb-6 flex gap-4">
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
            >
              Confirm & Save
            </button>
            <button
              onClick={handleExport}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              ⬇️ Export
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl mb-4 text-gray-800">Students Present ({students.length})</h2>
            <AttendanceList students={students} onUpdateStudent={handleUpdateStudent} />
          </div>
        </>
      )}
    </div>
  );
}
