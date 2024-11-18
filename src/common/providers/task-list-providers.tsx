'use client'

import { useRef } from 'react'
import { TaskStoreContext, taskStore } from '@/features/task/stores'

function TaskListProvider({ children }: { children: React.ReactNode }) {
  const store = useRef(taskStore).current
  return <TaskStoreContext.Provider value={store}>{children}</TaskStoreContext.Provider>
}

export default TaskListProvider
