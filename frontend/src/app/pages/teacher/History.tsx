import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import HistoryTable from '../../components/HistoryTable';

export default function TeacherHistory() {
  const navigate = useNavigate();
  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { default: api } = await import('../../api');
        const { data } = await api.get('/teacher/attendance/history');
        setRecords(data);
      } catch (error) {
        console.error('Failed to fetch history', error);
      }
    };
    fetchHistory();
  }, []);

  const handleView = (id: string) => {
    const record = records.find(r => r.id === id || r.sessionId === id);
    sessionStorage.setItem('attendanceSessionId', record?.sessionId || id);
    navigate('/teacher/result');
  };

  const handleExport = (id: string) => {
    const record = records.find(r => r.id === id);
    alert(`Exporting attendance for ${record?.subject} on ${record?.date}`);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl text-gray-800 mb-2">Attendance History</h1>
        <p className="text-gray-600">View and export past attendance records</p>
      </div>

      <HistoryTable records={records} onView={handleView} onExport={handleExport} />
    </div>
  );
}
