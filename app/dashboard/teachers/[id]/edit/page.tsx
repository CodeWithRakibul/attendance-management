import { notFound } from 'next/navigation';
import { TeacherEditForm } from './teacher-edit-form';
import { getTeacher } from '@/queries';

interface TeacherEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function TeacherEditPage({ params }: TeacherEditPageProps) {
  const id = (await (params)).id
  const teacher = await getTeacher(id);
  
  if (!teacher) {
    notFound();
  }

  return (
    <div className="flex-1 space-y-4">
      <TeacherEditForm teacher={teacher} />
    </div>
  );
}