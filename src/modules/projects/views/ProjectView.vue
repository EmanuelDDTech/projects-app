<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import BreadCrumbs from '@/modules/common/components/BreadCrumbs.vue';
import { useProjectsStore } from '../store/projects.store';
import { type Project } from '../interfaces/project.interface';


interface Props {
  id: string;
}

const router = useRouter();
const props = defineProps<Props>();
const projectStore = useProjectsStore();
const project = ref<Project>();
const newTask = ref('');

watch(() => props.id, () => {
  project.value = projectStore.projectList.find( project => project.id === props.id )
  if ( !project.value ) {
    router.replace('/');
  }
},
{
  immediate: true,
})

const addTask = () => {
  if (!project.value) return;
  projectStore.addTaskProject(newTask.value, project.value?.id!);
  newTask.value = '';
}
</script>
<template>
  <div class="w-full">
    <section class="m-2">
      <bread-crumbs :name="project?.name ?? 'No name'" />
    </section>

    <section class="m-2">
      <div class="overflow-x-auto">
        <table class="table">
          <!-- head -->
          <thead>
            <tr>
              <th class="w-14">Completada</th>
              <th>Tarea</th>
              <th>Completada en</th>
            </tr>
          </thead>
          <tbody>
            <tr class="hover" v-for="task in project?.tasks" :key="task.id" >
              <th>
                <input type="checkbox" :checked="!!task.completedAt" class="checkbox checkbox-primary" @change="projectStore.toogleTask(project?.id ?? '', task.id)">
              </th>
              <td>{{ task.name }}</td>
              <td>{{ task.completedAt ?? '' }}</td>
            </tr>
            <tr class="hover">
              <th></th>
              <td>
                <input type="text" class="input input-primary w-full opacity-60 transition-all hover:opacity-100 focus:opacity-100" placeholder="Nueva tarea" v-model="newTask" @keypress.enter="addTask" />
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
