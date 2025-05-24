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
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

input {
  padding: 0.5rem;
  border-radius: 5px;
}

select {
  padding: 0.5rem;
  border-radius: 5px;
}

button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  background-color: #2c80ec;
  color: white;
  cursor: pointer;
}

form div {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-weight: bold;
}
</style>
