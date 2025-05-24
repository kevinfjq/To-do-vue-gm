<script setup lang="ts">
  import { ref } from 'vue';
  const priorities = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    urgent: 'Urgent',
    critical: 'Critical',
  }

  type Priority = keyof typeof priorities;

  interface Task {
    id: number,
    text: string,
    priority: Priority,
    completed: boolean,
  }

  const newTaskText = ref('');
  const newTaskPriority = ref<Priority>('medium');
  const tasks = ref<Task[]>([]);
  tasks.value = [
    { id: 1, text: 'Buy groceries', priority: 'medium', completed: false },
    { id: 2, text: 'Finish project report', priority: 'high', completed: false },
    { id: 3, text: 'Call mom', priority: 'low', completed: true },
    { id: 4, text: 'Schedule dentist appointment', priority: 'urgent', completed: false }
  ];

  function addTask() {
    if(newTaskText.value.trim() === '') return;

    const newTask: Task = {
      id: tasks.value.length + 1,
      text: newTaskText.value,
      priority: newTaskPriority.value,
      completed: false,
    }
    tasks.value.push(newTask);
    newTaskText.value = '';
    newTaskPriority.value = 'medium';
  }
</script>

<template>
  <header>
      <h1>To do Gemini</h1>
  </header>
  <main>
    <section>
      <form @submit.prevent="addTask">
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
      <h2>Tasks</h2>
      <ul>
        <li v-for="task in tasks" :key="task.id">
          {{task.text}} - Priority: {{priorities[task.priority]}}
        </li>
      </ul>
    </section>
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
  width: 100%;
  display: flex;
  justify-content: center;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    width: 100%;
    justify-content: center;
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: center;
    flex-wrap: wrap;
  }
}
</style>
