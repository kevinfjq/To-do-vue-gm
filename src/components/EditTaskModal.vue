<script setup lang="ts">
  import { priorities } from '@/utils/priorities.ts'
  import type { Task } from '@/utils/tasks.ts'
  import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

  const localTaskData = defineModel<Task>({
    type: Object,
    default: () => ({
      id: '',
      text: '',
      priority: priorities.medium,
      completed: false,
      createdAt: new Date(),
    })
  })

  const modalIdSuffix = Math.random().toString(36).substring(2, 7);
  const modalTitleId = `modal-title-${modalIdSuffix}`;
  const taskTextInputId = `task-text-input-${modalIdSuffix}`;
  const taskPrioritySelectId = `task-priority-input-${modalIdSuffix}`;

  const props = defineProps({
    taskToEdit: {
      type: Object as () => Task | null,
      default: null
    } ,
    isVisible: {
      type: Boolean,
      default: false
    },
  })

  watch(() => props.taskToEdit, (newTask) => {
    localTaskData.value = newTask? JSON.parse(JSON.stringify(newTask)) : localTaskData.value
  }, {immediate: true, deep: true});

  const firstFocusableElement = ref<HTMLInputElement | null>(null);

  watch(() => props.isVisible, async (newValue) => {
    if (newValue && firstFocusableElement.value) {
      await nextTick();
      firstFocusableElement.value.focus();
    }
  }, {immediate: true})

  const emit = defineEmits<{
    (e: 'saveChanges', task: Task): void;
    (e: 'closeModal'): void;
  }>()

  const handleKeyDown = (e: KeyboardEvent) => {
    if( e.key === 'Escape') {
      emit('closeModal');
    }

  }

  onMounted(() => {
    if(props.isVisible) {
      document.addEventListener('keydown', handleKeyDown);
    }
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown);
  })

  function handleSaveChanges() {
    if (!localTaskData.value.text) return;
    emit('saveChanges', {...localTaskData.value});
    emit('closeModal');
  }

  function handleClose() {
    emit('closeModal');
  }
</script>

<template>
  <div class="modal-overlay" @click.self="handleClose">
    <div class="modal-content" role="dialog" aria-modal="true" :aria-labelledby="'modalTitleId'">
      <header class="modal-header">
        <h2 :id="modalTitleId" class="modal-title">Edit Task</h2>
        <button class="modal-close-button" @click="handleClose" aria-label="Close dialog">&times;</button>
      </header>
      <section class="modal-body">
        <form @submit.prevent="handleSaveChanges">
          <div>
            <label :for="taskTextInputId">Task Name:</label>
            <input :id="taskTextInputId" type="text" v-model="localTaskData.text" required ref="firstFocusableElement" />
          </div>
          <div>
            <label :for="taskPrioritySelectId">Priority:</label>
            <select :id="taskPrioritySelectId" v-model="localTaskData.priority" required>
              <option v-for="(value, key) in priorities" :key="key" :value="key">
                {{ value }}
              </option>
            </select>
          </div>
          <div class="modal-actions">
            <button type="button" class="cancel-button" @click="handleClose">Cancel</button>
            <button type="submit" class="save-button">Save Changes</button>
          </div>
        </form>
      </section>
    </div>
  </div>
</template>

<style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal-content {
    background-color: var(--color-background);
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    min-width: 300px;
    max-width: 500px;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--color-border);
    padding-bottom: 10px;
    margin-bottom: 15px;
  }

  .modal-title {
    margin: 0;
    font-size: 1.25rem;
  }

  .modal-close-button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #d7352d;
  }

  .modal-body form div {
    margin-bottom: 15px;
  }

  .modal-body label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }

  .modal-body input[type="text"],
  .modal-body textarea,
  .modal-body select {
    width: 100%;
    padding: 8px;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    box-sizing: border-box;
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
  }

  .modal-actions button {
    padding: 8px 15px;
    border-radius: 4px;
    cursor: pointer;
    border: 1px solid transparent;
  }

  .modal-actions button[type="submit"] {
    background-color: #007bff;
    color: white;
    border-color: #007bff;
  }

  .modal-actions button[type="button"] {
    background-color: #f0f0f0;
    color: #333;
    border-color: #ccc;
  }
</style>
