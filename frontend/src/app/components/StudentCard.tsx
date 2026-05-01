import { useState } from 'react';

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

interface StudentCardProps {
  student: Student;
  onUpdate?: (updatedStudent: Student) => void;
}

export default function StudentCard({ student, onUpdate }: StudentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editRollNo, setEditRollNo] = useState('');
  const [error, setError] = useState('');

  const handleFetch = async () => {
    // Mock student database
    const mockStudents: Record<string, Student> = {
      'CS001': {
        id: '1',
        name: 'John Doe',
        rollNo: 'CS001',
        email: 'john@example.com',
        department: 'Computer Science',
        year: '3rd Year',
        section: 'A',
      },
      'CS002': {
        id: '2',
        name: 'Jane Smith',
        rollNo: 'CS002',
        email: 'jane@example.com',
        department: 'Computer Science',
        year: '3rd Year',
        section: 'B',
      },
    };

    const foundStudent = mockStudents[editRollNo];

    if (foundStudent && onUpdate) {
      onUpdate(foundStudent);
      setIsEditing(false);
      setError('');
    } else {
      setError('Student not found');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-3 border border-gray-200">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-600 hover:text-gray-800 transition-colors"
        >
          {isExpanded ? '▼' : '▶'}
        </button>

        <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden">
          {student.image ? (
            <img src={student.image} alt={student.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white text-lg">
              {student.name.charAt(0)}
            </div>
          )}
        </div>

        <div className="flex-1">
          <p className="font-medium text-gray-800">{student.name}</p>
          <p className="text-sm text-gray-500">{student.rollNo}</p>
        </div>

        {isExpanded && (
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            ✏️
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="mt-4 pl-16 space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-gray-800">{student.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Department</p>
              <p className="text-gray-800">{student.department}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Year</p>
              <p className="text-gray-800">{student.year}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Section</p>
              <p className="text-gray-800">{student.section}</p>
            </div>
          </div>

          {isEditing && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700 mb-2">Edit Student</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editRollNo}
                  onChange={(e) => setEditRollNo(e.target.value)}
                  placeholder="Enter Roll Number"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleFetch}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Fetch
                </button>
              </div>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
