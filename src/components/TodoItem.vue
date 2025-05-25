<script setup lang="ts">
  import type { Task } from '@/utils/tasks.ts'

  const props = defineProps<{
    task: Task
  }>()

  const emit = defineEmits<{
    (e: 'toggleComplete', taskId: string): void;
    (e: 'deleteTask', taskId: string): void;
    (e: 'openEditModal', taskId: string): void;
  }>();

  function onToggleComplete() {
    emit('toggleComplete', props.task.id);
  }

  function onDeleteTask() {
    emit('deleteTask', props.task.id);
  }

  function openEditModal() {
    emit('openEditModal', props.task.id);
  }
</script>

<template>
  <li :class="{completed: task.completed}">
    <div class="task">
      <input type="checkbox" :checked="task.completed" @change="onToggleComplete" />
      <span class="task-text">{{task.text}}</span>
    </div>
    <div class="actions">
      <span :class="['priority-badge', `priority-${task.priority}`]">
        {{task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}}
      </span>
      <button @click="openEditModal">Edit &rightarrow;</button>
      <button @click="onDeleteTask">Delete</button>
    </div>
  </li>
</template>

<style scoped>
li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 8px;
}

.task {
  display: flex;
  align-items: center;
  gap: 10px;
}

.completed .task-text{
  text-decoration: line-through;
  color: #aaa;
}
.priority-badge {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.8em;
  color: white;
}

.actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.priority-critical {
  background-color: #5223e0;
}

.priority-urgent {
  background-color: #F44336;
}
.priority-high {
  background-color: #FF5722;
}
.priority-medium {
  background-color: #FFC107;
}
.priority-low {
  background-color: #4CAF50;
}


</style>
