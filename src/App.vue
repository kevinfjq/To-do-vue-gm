<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'
import type { Task } from '@/utils/tasks.ts'
import TodoForm from '@/components/TodoForm.vue'
import TodoList from '@/components/TodoList.vue'
import EditTaskModal from '@/components/EditTaskModal.vue'


  const tasks = ref<Task[]>([]);
  const showEditModal = ref(false);
  const taskToEditModal = ref<Task | null>(null)

  onMounted(() => {
    const storedTasks = localStorage.getItem('vue-todo-tasks');
    if(storedTasks) {
      tasks.value = JSON.parse(storedTasks);
    }
  })

  watch(tasks, (newTasks) => {
    localStorage.setItem('vue-todo-tasks', JSON.stringify(newTasks))
  }, {deep: true});

  let previouslyFocusedElement: Element | null = null

  async function openEditModal(taskId: string) {
    const task = tasks.value.find(t => t.id === taskId) || null;
    previouslyFocusedElement = document.activeElement;
    taskToEditModal.value = task;
    showEditModal.value = true;

    await nextTick();

    const taskClose = document.querySelector(".modal-close-button") as HTMLElement;
    taskClose?.focus();
  }

  async function closeModalAndRestoreFocus() {
    showEditModal.value = false;
    taskToEditModal.value = null;
    await nextTick();
    if(previouslyFocusedElement instanceof HTMLElement) {
      previouslyFocusedElement.focus();
    }
    previouslyFocusedElement = null;
  }

  function handleTaskSaved(updatedTask: Task) {
    const index = tasks.value.findIndex(t => t.id === updatedTask.id);
    if(index !== -1) {
      tasks.value[index] = {...tasks.value[index], ...updatedTask};
    }
    closeModalAndRestoreFocus();
  }

  function handleModalClose() {
    closeModalAndRestoreFocus();
  }

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
      <h1 class="title">To do Gemini</h1>
  </header>
  <main>
    <div id="app-container">
      <TodoForm @add-task="handleAddTask" />
      <TodoList
        :tasks="tasks"
        @toggleComplete="handleToggleComplete"
        @deleteTask="handleDeleteTask"
        @openEditModal="openEditModal"
      />

    </div>
    <Teleport to="#modal-outlet">
      <EditTaskModal
        v-if="showEditModal"
        :taskToEdit="taskToEditModal"
        :isVisible="showEditModal"
        @saveChanges="handleTaskSaved"
        @closeModal="handleModalClose"
      />
    </Teleport>
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 1rem 0; /* Added some padding */
  margin-bottom: 1rem; /* Space below header */
}

.title {
  font-size: clamp(1.8rem, 5vw, 2.5rem); /* Responsive font size */
  color: var(--color-heading); /* Use theme variable */
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1); /* Softer shadow */
  font-weight: 600; /* Bolder title */
}

#app-container {
  width: 90%; /* Use percentage for responsiveness */
  max-width: 700px; /* Max width for larger screens */
  margin: 20px auto;
  padding: clamp(15px, 4vw, 30px); /* Responsive padding */
  font-family: inherit; /* Inherit from body */
  background-color: var(--color-background-soft); /* Use theme variable */
  border-radius: 12px; /* Slightly larger radius */
  box-shadow: 0 4px 15px rgba(0,0,0,0.1); /* Enhanced shadow */
}
</style>
