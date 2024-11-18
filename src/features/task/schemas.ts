import { z } from 'zod'
import { taskSchema } from '@/lib/schemas/entities'
export const taskInputFormSchema = z.object({
  ...taskSchema.omit({
    id: true,
  }).shape,
  title: z.string().min(1, 'Title is required'),
  description: z.string(),
})
export type TaskInputForm = z.infer<typeof taskInputFormSchema>
