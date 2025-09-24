import { getStudentById } from '@/queries/student';
import { getSessions, getClasses, getBatches, getSections } from '@/queries';
import { StudentProfile } from './components/student-profile';
import { notFound } from 'next/navigation';

interface StudentPageProps {
  params: Promise<{ id: string }>;
}

export default async function StudentPage({ params }: StudentPageProps) {
  const { id } = await params;
  
  const student = await getStudentById(id);
  
  if (!student) {
    notFound();
  }

  const [sessions, classes, batches, sections] = await Promise.all([
    getSessions(),
    getClasses(student.sessionId),
    getBatches(undefined, student.sessionId),
    getSections(undefined, student.sessionId),
  ]);

  return (
    <StudentProfile 
      student={student}
      sessions={sessions}
      classes={classes}
      batches={batches}
      sections={sections}
    />
  );
}