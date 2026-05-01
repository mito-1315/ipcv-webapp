import StudentCard from './StudentCard';

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

interface AttendanceListProps {
  students: Student[];
  onUpdateStudent?: (index: number, student: Student) => void;
}

export default function AttendanceList({ students, onUpdateStudent }: AttendanceListProps) {
  return (
    <div className="space-y-2">
      {students.map((student, index) => (
        <StudentCard
          key={student.id}
          student={student}
          onUpdate={onUpdateStudent ? (updatedStudent) => onUpdateStudent(index, updatedStudent) : undefined}
        />
      ))}
    </div>
  );
}
