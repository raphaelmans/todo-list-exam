import { List, AutoSizer } from 'react-virtualized'
import { Task, TaskStatus } from '@/lib/schemas/entities'
import TaskItem from '@/features/task/components/task-item'
import { TaskInputForm } from '@/features/task/schemas'

type TaskListProps = {
  tasks: Task[]
  onEdit: (id: string, task: TaskInputForm) => Promise<unknown>
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: TaskStatus) => void
}

const TaskList = ({ tasks, onEdit, onDelete, onStatusChange }: TaskListProps) => {
  const rowRenderer = ({ index, key }: { index: number; key: string }) => {
    const task = tasks[index]
    return (
      <div key={key}>
        <TaskItem task={task} onEdit={onEdit} onDelete={onDelete} onStatusChange={onStatusChange} />
      </div>
    )
  }

  return (
    <div style={{ height: 'calc(100vh - 200px)', width: '100%' }}>
      <AutoSizer>
        {({ height, width }) => (
          <List
            height={height}
            width={width}
            rowCount={tasks.length}
            rowHeight={200}
            rowRenderer={rowRenderer}
          />
        )}
      </AutoSizer>
    </div>
  )
}

export default TaskList
