import { Task, TaskStatus } from '@/lib/schemas/entities'
import TaskItem from '@/features/task/components/task-item'
import { TaskInputForm } from '@/features/task/schemas'

type TaskListProps = {
  tasks: Task[]
  onEdit: (id: string, task: TaskInputForm) => Promise<unknown>
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: TaskStatus) => void
}

const TaskList = ({ tasks, onEdit, onDelete, onStatusChange }: TaskListProps) => {
  return (
    <div className='h-[calc(100vh-200px)]'>
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  )
}

export default TaskList
