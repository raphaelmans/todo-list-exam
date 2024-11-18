import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import TaskItem from '@/features/task/components/task-item'
import { Task, TaskStatus } from '@/lib/schemas/entities'
import { format } from 'date-fns'

describe('TaskItem', () => {
  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    status: 'todo' as TaskStatus,
    dueDate: new Date('2024-12-31'),
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const mockProps = {
    task: mockTask,
    onEdit: jest.fn(),
    onDelete: jest.fn(),
    onStatusChange: jest.fn(),
    isEditingTask: false,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders task details correctly', () => {
    render(<TaskItem {...mockProps} />)

    expect(screen.getByText(mockTask.title)).toBeInTheDocument()
    expect(screen.getByText(mockTask.description)).toBeInTheDocument()
    expect(screen.getByText(mockTask.status)).toBeInTheDocument()
    if (mockTask.dueDate) {
      expect(screen.getByText(`Due: ${format(mockTask.dueDate, 'PP')}`)).toBeInTheDocument()
    }
  })

  it('calls onDelete when delete button is clicked', () => {
    render(<TaskItem {...mockProps} />)

    const deleteButton = screen.getByText('Delete')
    fireEvent.click(deleteButton)

    expect(mockProps.onDelete).toHaveBeenCalledWith(mockTask.id)
  })

  it('calls onStatusChange when status is changed', () => {
    render(<TaskItem {...mockProps} />)

    const statusSelect = screen.getByRole('combobox')
    fireEvent.click(statusSelect)

    const inProgressOption = screen.getByText('In Progress')
    fireEvent.click(inProgressOption)

    expect(mockProps.onStatusChange).toHaveBeenCalledWith(mockTask.id, 'in_progress')
  })

  it('displays overdue badge for overdue tasks', () => {
    const overdueTask = {
      ...mockTask,
      dueDate: new Date('2023-01-01'), // Past date
    }

    render(<TaskItem {...mockProps} task={overdueTask} />)

    expect(screen.getByText('Overdue')).toBeInTheDocument()
  })

  it('applies correct styles for overdue tasks', () => {
    const overdueTask = {
      ...mockTask,
      dueDate: new Date('2023-01-01'), // Past date
    }

    const { container } = render(<TaskItem {...mockProps} task={overdueTask} />)

    const card = container.querySelector('.border-destructive')
    expect(card).toBeInTheDocument()
  })

  it('renders task without due date correctly', () => {
    const taskWithoutDueDate = {
      ...mockTask,
      dueDate: undefined,
    }

    render(<TaskItem {...mockProps} task={taskWithoutDueDate} />)

    expect(screen.queryByText(/Due:/)).not.toBeInTheDocument()
  })
})
