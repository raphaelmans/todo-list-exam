import { taskService } from '@/lib/services/task-service'
import { Task } from '@/lib/schemas/entities'

describe('taskService.isTaskOverdue', () => {
  const baseTask: Task = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    status: 'todo',
    createdAt: new Date(),
    updatedAt: new Date(),
    dueDate: undefined,
  }

  it('should return false when task has no due date', () => {
    const task = { ...baseTask, dueDate: undefined }
    expect(taskService.isTaskOverdue(task)).toBe(false)
  })

  it('should return false when task is completed', () => {
    const task: Task = {
      ...baseTask,
      status: 'completed',
      dueDate: new Date('2000-01-01'), // Past date
    }
    expect(taskService.isTaskOverdue(task)).toBe(false)
  })

  it('should return true when due date is in the past', () => {
    const task: Task = {
      ...baseTask,
      dueDate: new Date('2000-01-01'),
    }
    expect(taskService.isTaskOverdue(task)).toBe(true)
  })

  it('should return false when due date is today', () => {
    const today = new Date()
    const task: Task = {
      ...baseTask,
      dueDate: today,
    }
    expect(taskService.isTaskOverdue(task)).toBe(false)
  })

  it('should return false when due date is in the future', () => {
    const futureDate = new Date()
    futureDate.setFullYear(futureDate.getFullYear() + 1)
    const task = {
      ...baseTask,
      dueDate: futureDate,
    }
    expect(taskService.isTaskOverdue(task)).toBe(false)
  })
})
