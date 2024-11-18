import { FilterType, taskStore } from '@/features/task/stores'
import { Task, TaskStatus, taskSchema } from '@/lib/schemas/entities'

type TaskInput = {
  title: string
  description: string
  status: TaskStatus
  dueDate?: Date
}

export type GetTaskQueryParams = {
  status?: FilterType
  query?: string
}

export const taskService = {
  createTask(payload: TaskInput) {
    const store = taskStore.getState()
    const task = store.addTask(payload)
    return taskSchema.parse(task)
  },

  updateTask(id: string, payload: Partial<TaskInput>) {
    const store = taskStore.getState()
    const existingTask = store.getTaskById(id)

    if (!existingTask) {
      throw new Error('Task not found')
    }

    const updatedTask = {
      ...existingTask,
      ...payload,
    }

    store.editTask(updatedTask)
    return updatedTask
  },

  deleteTask(id: string) {
    const store = taskStore.getState()
    store.deleteTask(id)
    return { success: true }
  },

  getTask(id: string) {
    const store = taskStore.getState()
    const task = store.getTaskById(id)

    if (!task) {
      throw new Error('Task not found')
    }

    return task
  },

  getTasks(params?: GetTaskQueryParams) {
    const store = taskStore.getState()
    return store.getFilteredTasks(params)
  },

  updateTaskStatus(id: string, status: TaskStatus) {
    const store = taskStore.getState()
    store.setTaskStatus(id, status)
    return store.getTaskById(id)
  },

  isTaskOverdue: (task: Task) => {
    if (!task.dueDate || task.status === 'completed') return false
    return new Date() > new Date(task.dueDate)
  },
}
