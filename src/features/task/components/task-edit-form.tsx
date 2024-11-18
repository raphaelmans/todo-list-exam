'use client'
import { memo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TaskInputForm, taskInputFormSchema } from '../schemas'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FormField, FormItem, FormControl, Form } from '@/components/ui/form'
import { Task } from '@/lib/schemas/entities'

type TaskEditFormProps = {
  task: Task
  onEdit: (id: string, task: TaskInputForm) => Promise<unknown>
  isEditingTask?: boolean
  onCancel?: () => void
}

const TaskEditForm = memo(({ task, onEdit, isEditingTask, onCancel }: TaskEditFormProps) => {
  const form = useForm<TaskInputForm>({
    resolver: zodResolver(taskInputFormSchema),
    defaultValues: {
      title: task.title,
      description: task.description,
      status: task.status,
      dueDate: task.dueDate || new Date(),
    },
  })

  const {
    handleSubmit,
    reset,
    formState: { isDirty, isValid, isSubmitting },
  } = form

  const buttonDisabled = isSubmitting || !isDirty || !isValid || isEditingTask

  const onSubmit = async (data: TaskInputForm) => {
    try {
      await onEdit(task.id, data)
      onCancel?.()
    } catch (error) {
      console.error(error)
      reset(data, {
        keepDirty: true,
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type='text' placeholder='Task title' {...field} disabled={isEditingTask} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea placeholder='Task description' {...field} disabled={isEditingTask} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='status'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange} disabled={isEditingTask}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select status' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='todo'>Todo</SelectItem>
                    <SelectItem value='in_progress'>In Progress</SelectItem>
                    <SelectItem value='completed'>Completed</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='dueDate'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type='date'
                  {...field}
                  value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                  onChange={e =>
                    field.onChange(e.target.value ? new Date(e.target.value) : undefined)
                  }
                  disabled={isEditingTask}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className='flex gap-2'>
          <Button type='submit' disabled={buttonDisabled}>
            {isEditingTask ? 'Saving...' : 'Save Changes'}
          </Button>
          {onCancel && (
            <Button type='button' variant='outline' onClick={onCancel} disabled={isEditingTask}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
})

TaskEditForm.displayName = 'TaskEditForm'

export default TaskEditForm
