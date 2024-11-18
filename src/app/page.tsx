'use client'
import { useCallback } from 'react'
import TaskList from '@/features/task/components/task-list'
import { TaskStatus } from '@/lib/schemas/entities'
import AddTaskForm from '@/features/task/components/task-add-form'
import {
  useTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useUpdateTaskStatusMutation,
  useTaskFilters,
} from '@/features/task/hooks'
import { TaskInputForm } from '@/features/task/schemas'
import TaskListFilterPanel from '@/features/task/components/task-list-filter-panel'

export default function Home() {
  const { status, query } = useTaskFilters()
  const { data: tasks = [] } = useTasksQuery({ status, query })
  const { mutateAsync: createTask, isPending: isCreatingTask } = useCreateTaskMutation()
  const { mutate: updateTask } = useUpdateTaskMutation()
  const { mutate: deleteTask } = useDeleteTaskMutation()
  const { mutate: updateTaskStatus } = useUpdateTaskStatusMutation()

  const handleAddTask = useCallback(
    async (newTask: TaskInputForm) => {
      return createTask(newTask)
    },
    [createTask],
  )

  const handleEditTask = useCallback(
    async (id: string, editedTask: TaskInputForm) => {
      return updateTask({ id, payload: editedTask })
    },
    [updateTask],
  )

  const handleDeleteTask = useCallback(
    (id: string) => {
      deleteTask(id)
    },
    [deleteTask],
  )

  const handleStatusChange = useCallback(
    (id: string, status: TaskStatus) => {
      updateTaskStatus({ id, status })
    },
    [updateTaskStatus],
  )

  return (
    <div className='container mx-auto flex flex-col gap-6 p-4'>
      <h1 className='text-3xl font-bold'>To-Do List</h1>
      <div>
        <AddTaskForm onAdd={handleAddTask} isCreatingTask={isCreatingTask} />
      </div>
      <TaskListFilterPanel />
      <TaskList
        tasks={tasks}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
        onStatusChange={handleStatusChange}
      />
    </div>
  )
}
