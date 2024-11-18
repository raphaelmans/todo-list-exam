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

type AddTaskFormProps = {
  onAdd: (task: TaskInputForm) => Promise<unknown>
  isCreatingTask?: boolean
}

const AddTaskForm = memo(({ onAdd, isCreatingTask }: AddTaskFormProps) => {
  const form = useForm<TaskInputForm>({
    resolver: zodResolver(taskInputFormSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'todo',
      dueDate: new Date(),
    },
  })

  const {
    handleSubmit,
    reset,
    formState: { isDirty, isValid, isSubmitting },
  } = form

  const buttonDisabled = isSubmitting || !isDirty || !isValid || isCreatingTask

  const onSubmit = async (data: TaskInputForm) => {
    try {
      await onAdd(data)
      reset()
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
                <Input type='text' placeholder='Task title' {...field} disabled={isCreatingTask} />
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
                <Textarea placeholder='Task description' {...field} disabled={isCreatingTask} />
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
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isCreatingTask}
                >
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
                  disabled={isCreatingTask}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type='submit' disabled={buttonDisabled}>
          {isCreatingTask ? 'Adding...' : 'Add Task'}
        </Button>
      </form>
    </Form>
  )
})

AddTaskForm.displayName = 'AddTaskForm'

export default AddTaskForm
