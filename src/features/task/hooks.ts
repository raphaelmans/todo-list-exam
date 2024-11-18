'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createQueryKeys } from '@lukemorales/query-key-factory'
import { useQueryState } from 'nuqs'
import { useEffect } from 'react'
import { TaskStatus } from '@/lib/schemas/entities'
import { GetTaskQueryParams, taskService } from '@/lib/services/task-service'

export const taskQueryKeys = createQueryKeys('task', {
  all: (params?: GetTaskQueryParams) => ({
    queryKey: ['tasks', params],
  }),
  detail: (id: string | undefined) => ({
    queryKey: ['task', id],
  }),
})

export const useTasksQuery = (params?: GetTaskQueryParams) => {
  return useQuery({
    queryKey: taskQueryKeys.all(params).queryKey,
    queryFn: () => taskService.getTasks(params),
  })
}

export const useTaskQuery = (id: string | undefined) => {
  return useQuery({
    queryKey: taskQueryKeys.detail(id).queryKey,
    queryFn: () => {
      if (!id) {
        throw new Error('Task ID is required')
      }
      return taskService.getTask(id)
    },
    enabled: !!id,
  })
}

type TaskInput = {
  title: string
  description: string
  status: TaskStatus
  dueDate?: Date
}
export const useCreateTaskMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: TaskInput) => taskService.createTask(payload),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: taskQueryKeys.all._def })
    },
  })
}

export const useUpdateTaskMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<TaskInput> }) =>
      taskService.updateTask(id, payload),
    onSuccess: (_, { id }) => {
      return Promise.allSettled([
        queryClient.invalidateQueries({ queryKey: taskQueryKeys.all._def }),
        queryClient.invalidateQueries({ queryKey: taskQueryKeys.detail(id).queryKey }),
      ])
    },
  })
}

export const useDeleteTaskMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => taskService.deleteTask(id),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: taskQueryKeys.all._def })
    },
  })
}

export const useUpdateTaskStatusMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: TaskStatus }) =>
      taskService.updateTaskStatus(id, status),
    onSuccess: (_, { id }) => {
      return Promise.allSettled([
        queryClient.invalidateQueries({ queryKey: taskQueryKeys.all._def }),
        queryClient.invalidateQueries({ queryKey: taskQueryKeys.detail(id).queryKey }),
      ])
    },
  })
}

export const useTaskFilters = () => {
  const queryClient = useQueryClient()
  const [status, setStatus] = useQueryState('status', {
    defaultValue: 'all' as const,
    parse: (value: string) => value as TaskStatus | 'all',
  })

  const [query, setQuery] = useQueryState('query', {
    defaultValue: '',
  })

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: taskQueryKeys.all({ status, query }).queryKey })
  }, [status, query, queryClient])

  return {
    status,
    query,
    setStatus,
    setQuery,
  }
}
