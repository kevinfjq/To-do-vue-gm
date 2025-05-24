import type { Priority } from '@/utils/priorities.ts'

export interface Task {
  id: string,
  text: string,
  priority: Priority,
  completed: boolean,
  createdAt: Date,
}
