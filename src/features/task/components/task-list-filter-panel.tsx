import React, { useCallback, useMemo } from 'react'
import debounce from 'debounce'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { TaskStatus } from '@/lib/schemas/entities'
import { useTaskFilters } from '@/features/task/hooks'

const TaskListFilterPanel = () => {
  const { status, query, setStatus, setQuery } = useTaskFilters()

  const debouncedSetQuery = useMemo(
    () =>
      debounce((value: string) => {
        setQuery(value)
      }, 500),
    [setQuery],
  )

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      debouncedSetQuery(e.target.value)
    },
    [debouncedSetQuery],
  )

  const handleFilterChange = useCallback(
    (value: TaskStatus | 'all') => {
      setStatus(value)
    },
    [setStatus],
  )

  return (
    <div className='mb-4 flex gap-4'>
      <Input
        type='text'
        placeholder='Search tasks'
        defaultValue={query}
        onChange={handleSearchChange}
        className='flex-grow'
      />
      <Select value={status} onValueChange={handleFilterChange}>
        <SelectTrigger className='w-[180px]'>
          <SelectValue placeholder='Filter by status' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>All</SelectItem>
          <SelectItem value='todo'>Todo</SelectItem>
          <SelectItem value='in_progress'>In Progress</SelectItem>
          <SelectItem value='completed'>Completed</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

export default TaskListFilterPanel
