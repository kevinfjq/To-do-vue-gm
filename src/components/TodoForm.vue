<script setup lang="ts">
  import { ref } from 'vue';
  import type { Priority } from '@/utils/priorities.ts'
  const emit = defineEmits<{
    (e: 'add-task', task: { text: string, priority: Priority }): void;
  }>();

  const priorities = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    urgent: 'Urgent',
    critical: 'Critical',
  }

  const newTaskText = ref('');
  const newTaskPriority = ref<Priority>('medium');

  function handleSubmit() {
    if (newTaskText.value.trim() === '') return;
    emit('add-task', {text: newTaskText.value, priority: newTaskPriority.value});
    newTaskText.value = '';
    newTaskPriority.value = 'medium';
  }
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <h2>Add a New Task</h2>
    <div>
      <label for="new-task-input">Task:</label>
      <input
        id="new-task-input"
        type="text"
        v-model="newTaskText"
        placeholder="Task description"
        required
      >
    </div>
    <div>
      <label for="new-task-priority">Priority:</label>
      <select
        id="new-task-priority"
        v-model="newTaskPriority"
      >
        <option
          v-for="(value, key) in priorities" :key="key" :value="key"
        >
          {{value}}
        </option>
      </select>
    </div>
    <button type="submit">Create task</button>
  </form>
</template>

<style scoped>
form {
  margin-bottom: 2rem;
  padding: clamp(1rem, 5vw, 1.5rem); /* Responsive padding */
  border: 1px solid var(--color-border);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 1.25rem; /* Increased gap */
  background-color: var(--color-background-mute); /* Subtle background */
}

h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-heading);
  margin-bottom: 0.5rem; /* Space below heading */
}

form div {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-weight: 500; /* Slightly less bold */
  color: var(--color-text);
  font-size: 0.95rem;
}

input[type="text"],
select {
  padding: 0.75rem; /* Increased padding */
  border-radius: 6px; /* Slightly larger radius */
  border: 1px solid var(--color-border-hover);
  background-color: var(--color-background);
  color: var(--color-text);
  font-size: 1rem;
  width: 100%; /* Ensure full width */
  box-sizing: border-box; /* Include padding and border in the element's total width and height */
}

input[type="text"]:focus,
select:focus {
  outline: none;
  border-color: #2c80ec; /* Highlight color from button */
  box-shadow: 0 0 0 2px rgba(44, 128, 236, 0.2);
}

button[type="submit"] {
  padding: 0.75rem 1.5rem; /* Increased padding */
  border: none;
  border-radius: 6px;
  background-color: #2c80ec;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: background-color 0.2s ease-in-out;
  align-self: flex-start; /* Align button to the start */
}

button[type="submit"]:hover {
  background-color: #1a6ac4;
}

select {
  padding: 0.5rem;
  border-radius: 5px;
}
</style>
