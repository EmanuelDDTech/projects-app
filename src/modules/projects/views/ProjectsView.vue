<template>
  <div class="overflow-x-auto w-full">
    <table class="table">
      <!-- head -->
      <thead>
        <tr>
          <th></th>
          <th>Proyecto</th>
          <th>Tareas</th>
          <th>Avance</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(project, index) in projectsStore.projectsWithCompletion"
          :key="project.id"
          class="hover"
        >
          <th>{{ index + 1 }}</th>
          <td>{{ project.name }}</td>
          <td>{{ project.taskCount }}</td>
          <td>
            <progress
              class="progress progress-primary w-56"
              :value="project.completion"
              max="100"
            ></progress>
            {{ project.completion }}%
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <input-modal
    :open="modalOpen"
    @close="modalOpen = false"
    @value="projectsStore.addProject"
    title="Nuevo proyecto"
    subtitle="Dale un nombre único a tu proyecto"
    placeholder="Ingrese el nombre del proyecto"
  />

  <custom-modal :open="customModalOpen">
    <template #header>
      <h2 class="text-3xl">Titulo del modal</h2>
    </template>

    <template #body>
      <p>
        Reprehenderit eiusmod pariatur Lorem est laboris nulla Lorem cupidatat
        consequat irure non nisi est.
      </p>
    </template>

    <template #footer>
      <div class="flex justify-end">
        <button @click="customModalOpen = false" class="btn mr-4">Close</button>
        <button @click="customModalOpen = false" class="btn btn-primary">
          Aceptar
        </button>
      </div>
    </template>
  </custom-modal>

  <fab-button @click="modalOpen = true">
    <add-circle />
  </fab-button>

  <fab-button @click="customModalOpen = true" position="bottom-left">
    <modal-icon />
  </fab-button>
</template>

<script setup lang="ts">
import CustomModal from '@/modules/common/components/CustomModal.vue';
import FabButton from '@/modules/common/components/FabButton.vue';
import InputModal from '@/modules/common/components/InputModal.vue';
import AddCircle from '@/modules/common/icons/AddCircle.vue';
import ModalIcon from '@/modules/common/icons/ModalIcon.vue';
import { ref } from 'vue';
import { useProjectsStore } from '../store/projects.store';

const modalOpen = ref(false);
const customModalOpen = ref(false);

const projectsStore = useProjectsStore();
</script>
