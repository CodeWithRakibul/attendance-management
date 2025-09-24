import { TeacherEditForm } from '../[id]/edit/teacher-edit-form'

export default function TeacherCreatePage() {
  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Add New Teacher</h1>
      </div>
      <TeacherEditForm isEdit={false} />
    </div>
  )
}
