import { getStudentById } from '@/queries/student';
import { getSessions, getClasses, getBatches, getSections } from '@/queries';
import { StudentEditForm } from './components/student-edit-form';
import { notFound } from 'next/navigation';

interface StudentEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function StudentEditPage({ params }: StudentEditPageProps) {
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
    <StudentEditForm 
      student={student}
      sessions={sessions}
      classes={classes}
      batches={batches}
      sections={sections}
    />
  );
}