import { z } from 'zod'

export type APIResponse<T> = {
  success: boolean
  data: T
}

export const apiResponseStatuses = ['Success', 'Error'] as const
export const apiResponseSchema = <T>(schema: z.ZodType<T>) =>
  z.object({
    status: z.enum(apiResponseStatuses),
    data: schema,
  })
