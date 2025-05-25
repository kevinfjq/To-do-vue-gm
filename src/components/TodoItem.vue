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
      <input :id="`item-${task.id}`" type="checkbox" :checked="task.completed" @change="onToggleComplete" />
      <label :for="`item-${task.id}`" class="task-text">{{task.text}}</label>
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
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: var(--color-background);
  border-radius: 6px;
  border: 1px solid var(--color-border);
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  transition: box-shadow 0.2s ease-in-out;
}

li:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.08);
}

.task {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-grow: 1;
  min-width: 200px;
}

.task input[type="checkbox"] {
  width: 1.25em;
  height: 1.25em;
  cursor: pointer;
}

.task-text {
  font-size: 1rem;
  color: var(--color-text);
  word-break: break-word;
}

.completed .task-text {
  text-decoration: line-through;
  color: var(--vt-c-text-dark-2);
}

.actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

.priority-badge {
  padding: 0.25em 0.6em;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  color: white;
  text-transform: capitalize;
}

.actions button {
  padding: 0.5rem 0.85rem;
  border: 1px solid transparent;
  border-radius: 5px;
  color: var(--color-text);
  background-color: var(--color-background-mute);
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out;
}

.actions button:hover {
  background-color: var(--color-border);
}

.actions button:first-of-type {
   color: #2c80ec;
   border-color: #2c80ec;
}

.actions button:last-of-type {
  color: #d7352d;
}
.actions button:last-of-type:hover {
  background-color: #d7352d;
  color: white;
}



.priority-critical { background-color: #5223e0; }
.priority-urgent { background-color: #F44336; }
.priority-high { background-color: #FF5722; }
.priority-medium { background-color: #FFC107; }
.priority-low { background-color: #4CAF50; }

/* Responsive adjustments for list items */
@media (max-width: 600px) {
  li {
    flex-direction: column;
    align-items: flex-start;
  }

  .actions {
    width: 100%;
    justify-content: flex-start;
    margin-top: 0.75rem;
  }
}


</style>
