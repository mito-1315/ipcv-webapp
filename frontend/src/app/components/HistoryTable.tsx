interface HistoryRecord {
  id?: string;
  sessionId?: string;
  date: string;
  subject: string;
  totalStudents?: number;
  presentStudents?: string[];
  status?: string;
  teacherId?: { _id: string; name: string };
}

interface HistoryTableProps {
  records: HistoryRecord[];
  onView?: (id: string) => void;
  onExport?: (id: string) => void;
}

export default function HistoryTable({ records, onView, onExport }: HistoryTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="px-6 py-3 text-left text-sm text-gray-700">Date</th>
            <th className="px-6 py-3 text-left text-sm text-gray-700">Subject</th>
            <th className="px-6 py-3 text-left text-sm text-gray-700">Marked By</th>
            <th className="px-6 py-3 text-left text-sm text-gray-700">Total Students</th>
            <th className="px-6 py-3 text-left text-sm text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => {
            const uid = record.sessionId || record.id || Math.random().toString();
            return (
              <tr key={uid} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-800">{record.date}</td>
                <td className="px-6 py-4 text-gray-800">
                  {record.subject} 
                  {record.status && <span className={`ml-2 text-xs px-2 py-1 rounded ${record.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{record.status}</span>}
                </td>
                <td className="px-6 py-4 text-gray-800">
                  {record.teacherId?.name || 'Unknown'}
                </td>
                <td className="px-6 py-4 text-gray-800">
                  {record.presentStudents ? record.presentStudents.length : record.totalStudents}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {onView && (
                      <button
                        onClick={() => onView(uid)}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                      >
                        View
                      </button>
                    )}
                    {onExport && (
                      <button
                        onClick={() => onExport(uid)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                      >
                        ⬇️ Export
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
