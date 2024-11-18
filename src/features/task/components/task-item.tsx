import { memo } from 'react'
import { format } from 'date-fns'
import { TaskInputForm } from '../schemas'
import TaskEditModal from './task-edit-modal'
import { Task, TaskStatus } from '@/lib/schemas/entities'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { taskService } from '@/lib/services/task-service'

type TaskItemProps = {
  task: Task
  onEdit: (id: string, task: TaskInputForm) => Promise<unknown>
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: TaskStatus) => void
  isEditingTask?: boolean
}

const TaskItem = memo(
  ({ task, onEdit, onDelete, onStatusChange, isEditingTask }: TaskItemProps) => {
    const isOverdue = taskService.isTaskOverdue(task)

    return (
      <Card
        className={cn('mb-4 transition-colors', {
          'border-2 border-destructive bg-destructive/5': isOverdue,
          'hover:border-destructive/50': isOverdue,
        })}
      >
        <CardContent className='p-4'>
          <h3 className='mb-2 text-lg font-semibold'>{task.title}</h3>
          <p className='mb-2 text-gray-600'>{task.description}</p>
          <div className='flex items-center justify-between'>
            <Badge
              variant={
                task.status === 'completed' ? 'success' : isOverdue ? 'destructive' : 'default'
              }
            >
              {task.status}
            </Badge>
            {task.dueDate && (
              <div className='flex items-center gap-2'>
                <span
                  className={cn('text-sm', {
                    'font-medium text-destructive': isOverdue,
                    'text-muted-foreground': !isOverdue,
                  })}
                >
                  Due: {format(new Date(task.dueDate), 'PP')}
                </span>
                {isOverdue && (
                  <Badge variant='destructive' className='animate-pulse'>
                    Overdue
                  </Badge>
                )}
              </div>
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
