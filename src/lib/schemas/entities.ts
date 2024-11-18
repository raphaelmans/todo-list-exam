import { z } from 'zod'

const taskStatuses = ['todo', 'in_progress', 'completed'] as const
const taskStatusSchema = z.enum(taskStatuses)

export const todoItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  status: taskStatusSchema,
  dueDate: z.date().optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
  deletedAt: z.date().optional(),
})

export type TodoItem = z.infer<typeof todoItemSchema>
