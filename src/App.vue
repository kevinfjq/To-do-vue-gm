<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import type { Task } from '@/utils/tasks.ts'
import TodoForm from '@/components/TodoForm.vue'
import TodoList from '@/components/TodoList.vue'


  const tasks = ref<Task[]>([]);

  onMounted(() => {
    const storedTasks = localStorage.getItem('vue-todo-tasks');
    if(storedTasks) {
      tasks.value = JSON.parse(storedTasks);
    }
  })

watch(tasks, (newTasks) => {
  localStorage.setItem('vue-todo-tasks', JSON.stringify(newTasks))
}, {deep: true});



  function handleAddTask(newTaskData: { text: string, priority: Task['priority'] }) {
    const newTask: Task = {
      id: Date.now().toString(),
      text: newTaskData.text,
      priority: newTaskData.priority,
      completed: false,
      createdAt: new Date(),
    }
    tasks.value.unshift(newTask);
  }

  function handleToggleComplete(taskId: string) {
    const task = tasks.value.find(t => t.id === taskId);
    if(task) {
      task.completed = !task.completed;
    }
  }

  function handleDeleteTask(taskId: string) {
    tasks.value = tasks.value.filter(t => t.id !== taskId);
  }

</script>

<template>
  <header>
      <h1>To do Gemini</h1>
  </header>
  <main>
    <div id="app-container">
      <TodoForm @add-task="handleAddTask" />
      <TodoList
        :tasks="tasks"
        @toggleComplete="handleToggleComplete"
        @deleteTask="handleDeleteTask"
      />
    </div>
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
  width: 100%;
  display: flex;
  justify-content: center;
}

#app-container {
  width: 50lvw;
  margin: 20px auto;
  padding: 20px;
  font-family: sans-serif;
  background-color: #423939;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
h1 {
  text-align: center;
  color: #333;
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
