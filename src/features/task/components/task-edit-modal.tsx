'use client'
import { memo, useState } from 'react'
import { TaskInputForm } from '../schemas'
import TaskEditForm from './task-edit-form'
import { Task } from '@/lib/schemas/entities'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

type TaskEditModalProps = {
  task: Task
  onEdit: (id: string, task: TaskInputForm) => Promise<unknown>
  isEditingTask?: boolean
}

const TaskEditModal = memo(({ task, onEdit, isEditingTask }: TaskEditModalProps) => {
  const [open, setOpen] = useState(false)

  const handleEdit = async (id: string, editedTask: TaskInputForm) => {
    await onEdit(id, editedTask)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm'>
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <TaskEditForm
          task={task}
          onEdit={handleEdit}
          isEditingTask={isEditingTask}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
})

TaskEditModal.displayName = 'TaskEditModal'

export default TaskEditModal
