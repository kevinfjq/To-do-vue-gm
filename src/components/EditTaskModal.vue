<script setup lang="ts">
  import { priorities } from '@/utils/priorities.ts'
  import type { Task } from '@/utils/tasks.ts'
  import { nextTick, ref, watch } from 'vue'

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

  const modalOverlayRef = ref<HTMLDivElement | null>(null);


  watch(() => props.isVisible, async (newValue) => {
    if (newValue) {
      await nextTick(() => {
        firstFocusableElement.value?.focus();
      });
    }
  })

  const emit = defineEmits<{
    (e: 'saveChanges', task: Task): void;
    (e: 'closeModal'): void;
  }>()

  const handleKeyDown = (e: KeyboardEvent) => {
    if( e.key === 'Escape') {
      emit('closeModal');
      return;
    }

    if(e.key === 'Tab') {

      if (!modalOverlayRef.value) return;
      const focusable = Array.from(
        modalOverlayRef.value.querySelectorAll('input, select, textarea, button')
      ).filter(el => !el.hasAttribute('disabled')) as HTMLElement[];

      if(focusable.length === 0) return;

      const first = focusable[0] as HTMLElement;
      const last = focusable[focusable.length - 1] as HTMLElement;

      if(e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if(!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }


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
  <div
    class="modal-overlay"
    @click.self="handleClose"
    ref="modalOverlayRef"
    @keydown="handleKeyDown"
  >
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
  background-color: rgba(0, 0, 0, 0.65);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
  box-sizing: border-box;
}

.modal-content {
  background-color: var(--color-background);
  padding: clamp(20px, 5vw, 30px);
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 500px;
  min-width: unset;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 0.75rem;
  margin-bottom: 1.25rem;
}

.modal-title {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 600;
  color: var(--color-heading);
}

.modal-close-button {
  background: none;
  border: none;
  font-size: 1.75rem;
  cursor: pointer;
  color: var(--color-text);
  padding: 0.25rem;
  line-height: 1;
  transition: color 0.2s ease-in-out;
}

.modal-close-button:hover {
  color: #d7352d;
}

.modal-body form div {
  margin-bottom: 1.25rem;
}

.modal-body label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--color-text);
  font-size: 0.95rem;
}

.modal-body input[type="text"],
.modal-body textarea,
.modal-body select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border-hover);
  border-radius: 6px;
  box-sizing: border-box;
  background-color: var(--color-background);
  color: var(--color-text);
  font-size: 1rem;
}

.modal-body input[type="text"]:focus,
.modal-body textarea:focus,
.modal-body select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.2);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.modal-actions button {
  padding: 0.65rem 1.25rem;
  border-radius: 6px;
  cursor: pointer;
  border: 1px solid transparent;
  font-size: 0.95rem;
  font-weight: 500;
  transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out;
}

.modal-actions .save-button {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}
.modal-actions .save-button:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}

.modal-actions .cancel-button {
  background-color: var(--color-background-mute);
  color: var(--color-text);
  border-color: var(--color-border);
}

.modal-actions.cancel-button:hover {
  background-color: var(--color-border);
}
</style>
