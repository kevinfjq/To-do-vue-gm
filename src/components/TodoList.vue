<script setup lang="ts">
import { computed } from 'vue'
import TodoItem from '@/components/TodoItem.vue'
import type { Task } from '@/utils/tasks.ts'

const props = defineProps<{
  tasks: Task[]
}>()

const emit = defineEmits<{
  (e: 'toggleComplete', taskId: string): void;
  (e: 'deleteTask', taskId: string): void;
  (e: 'openEditModal', taskId: string): void;
}>()

const priorityOrder = { critical: 1, urgent: 2, high: 3, medium: 4, low: 5};

const sortedTasks = computed(() => {
  return [...props.tasks].sort((a, b) => {
    if(priorityOrder[a.priority] === priorityOrder[b.priority]) {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  })
})

function handleToggleComplete(taskId: string) {
  emit('toggleComplete', taskId);
}

function handleDeleteTask(taskId: string) {
  emit('deleteTask', taskId);
}

function handleOpenEditModal(taskId: string) {
  const task = props.tasks.find(t => t.id === taskId);
  if (task) {
    emit('openEditModal', task.id);
  }
}
</script>

<template>
  <p v-show="sortedTasks.length === 0">No tasks yet! Add one above.</p>
  <ul>
    <TodoItem
      v-for="task in sortedTasks"
      :key="task.id"
      :task="task"
      @toggleComplete="handleToggleComplete"
      @deleteTask="handleDeleteTask"
      @openEditModal="handleOpenEditModal"
    />
  </ul>
</template>

<style scoped>
ul {
  width: 100%;
  list-style: none; /* Remove default list bullets */
  padding: 0; /* Remove default padding */
}

p { /* Style for "No tasks yet!" message */
  text-align: center;
  color: var(--color-text); /* Or appropriate theme color */
  padding: 1rem;
  font-style: italic;
}
</style>
