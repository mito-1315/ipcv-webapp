import { useState, useEffect } from 'react';
import HistoryTable from '../../components/HistoryTable';

export default function AdminHistory() {
  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { default: api } = await import('../../api');
        const { data } = await api.get('/admin/history');
        setRecords(data);
      } catch (error) {
        console.error('Failed to fetch admin history', error);
      }
    };
    fetchHistory();
  }, []);

  const handleView = (id: string) => {
    alert(`Viewing details for record ${id}`);
  };

  const handleExport = (id: string) => {
    const record = records.find(r => r.id === id);
    alert(`Exporting attendance for ${record?.subject} on ${record?.date}`);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl text-gray-800 mb-2">Attendance History</h1>
        <p className="text-gray-600">View all attendance records across all classes</p>
      </div>

      <HistoryTable records={records} onView={handleView} onExport={handleExport} />
    </div>
  );
}
