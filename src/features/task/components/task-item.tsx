import { memo } from 'react'
import { format } from 'date-fns'
import { TaskInputForm } from '../schemas'
import TaskEditModal from './task-edit-modal'
import { Task, TaskStatus } from '@/lib/schemas/entities'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type TaskItemProps = {
  task: Task
  onEdit: (id: string, task: TaskInputForm) => Promise<unknown>
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: TaskStatus) => void
  isEditingTask?: boolean
}

const TaskItem = memo(
  ({ task, onEdit, onDelete, onStatusChange, isEditingTask }: TaskItemProps) => {
    const isOverdue = task.dueDate && new Date() > new Date(task.dueDate)

    return (
      <Card className={`mb-4 ${isOverdue ? 'border-red-500' : ''}`}>
        <CardContent className='p-4'>
          <h3 className='mb-2 text-lg font-semibold'>{task.title}</h3>
          <p className='mb-2 text-gray-600'>{task.description}</p>
          <div className='flex items-center justify-between'>
            <Badge variant={task.status === 'completed' ? 'success' : 'default'}>
              {task.status}
            </Badge>
            {task.dueDate && (
              <span className={`text-sm ${isOverdue ? 'text-red-500' : 'text-gray-500'}`}>
                Due: {format(new Date(task.dueDate), 'PP')}
              </span>
            )}
          </div>
        </CardContent>
        <CardFooter className='flex justify-end gap-2 p-4'>
          <TaskEditModal task={task} onEdit={onEdit} isEditingTask={isEditingTask} />
          <Button variant='destructive' size='sm' onClick={() => onDelete(task.id)}>
            Delete
          </Button>
          <Select
            value={task.status}
            onValueChange={(value: TaskStatus) => onStatusChange(task.id, value)}
          >
            <SelectTrigger className='w-[140px]'>
              <SelectValue placeholder='Change status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='todo'>Todo</SelectItem>
              <SelectItem value='in_progress'>In Progress</SelectItem>
              <SelectItem value='completed'>Completed</SelectItem>
            </SelectContent>
          </Select>
        </CardFooter>
      </Card>
    )
  },
)

TaskItem.displayName = 'TaskItem'

export default TaskItem
