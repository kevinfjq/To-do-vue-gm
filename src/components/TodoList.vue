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
    />
  </ul>
</template>

<style scoped>
  ul {
    width: 100%;
  }
</style>
