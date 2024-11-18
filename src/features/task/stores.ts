'use client'
import { createContext, useContext } from 'react'
import { useStore } from 'zustand'
import { shallow } from 'zustand/shallow'
import { v4 as uuidv4 } from 'uuid'
import { createWithEqualityFn } from 'zustand/traditional'
import { Task, TaskStatus } from '@/lib/schemas/entities'
import { GetTaskQueryParams } from '@/lib/services/task-service'

export type FilterType = TaskStatus | 'all'

export type TaskStore = {
  tasks: Task[]
  filter: FilterType
  searchQuery: string
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>) => Task
  editTask: (task: Task) => void
  deleteTask: (id: string) => void
  setTaskStatus: (id: string, status: TaskStatus) => void
  setFilter: (filter: FilterType) => void
  setSearchQuery: (query: string) => void
  getFilteredTasks: (params?: GetTaskQueryParams) => Task[]
  getTaskById: (id: string) => Task | undefined
  getOverdueTasks: () => Task[]
}

export const taskStore = createWithEqualityFn<TaskStore>(
  (set, get) => ({
    tasks: [],
    filter: 'all',
    searchQuery: '',

    addTask: newTask => {
      const task = {
        ...newTask,
        id: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      set(state => ({
        tasks: [...state.tasks, task],
      }))
      return task
    },

    editTask: editedTask => {
      set(state => ({
        tasks: state.tasks.map(task =>
          task.id === editedTask.id ? { ...editedTask, updatedAt: new Date() } : task,
        ),
      }))
    },

    deleteTask: id => {
      set(state => ({
        tasks: state.tasks.filter(task => task.id !== id),
      }))
    },

    setTaskStatus: (id, status) => {
      set(state => ({
        tasks: state.tasks.map(task =>
          task.id === id ? { ...task, status, updatedAt: new Date() } : task,
        ),
      }))
    },

    setFilter: filter => set({ filter }),
    setSearchQuery: searchQuery => set({ searchQuery }),

    getFilteredTasks: (params?: GetTaskQueryParams) => {
      const { tasks } = get()
      let filteredTasks = [...tasks]

      if (params?.status && params.status !== 'all') {
        filteredTasks = filteredTasks.filter(task => task.status === params.status)
      }

      if (params?.query && params.query.length > 0) {
        const searchLower = params.query.toLowerCase()
        filteredTasks = filteredTasks.filter(
          task =>
            task.title.toLowerCase().includes(searchLower) ||
            task.description.toLowerCase().includes(searchLower),
        )
      }

      return filteredTasks
    },

    getTaskById: id => {
      return get().tasks.find(task => task.id === id)
    },

    getOverdueTasks: () => {
      const now = new Date()
      return get().tasks.filter(
        task => task.dueDate && new Date(task.dueDate) < now && task.status !== 'completed',
      )
    },
  }),
  shallow,
)

export type TaskStoreAPI = typeof taskStore

export const TaskStoreContext = createContext<TaskStoreAPI | null>(null)

export const useTaskStore = <T>(selector: (state: TaskStore) => T): T => {
  const store = useContext(TaskStoreContext)
  if (!store) {
    throw new Error('TaskStoreContext is not provided')
  }
  return useStore(store, selector)
}
