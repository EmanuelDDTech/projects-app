import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { Project, Task } from '../interfaces/project.interface';
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorage } from '@vueuse/core';

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref(useLocalStorage<Project[]>('projects', []));

  const addProject = (name: string) => {
    if (name.length === 0) return;

    projects.value.push({
      id: uuidv4(),
      name: name,
      tasks: [],
    });
  };

  const addTaskProject = (name: string, projectId: string) => {
    if(name.trim().length === 0) return;

    const project = projects.value.find(project => project.id === projectId);
    if (!project) return;

    project.tasks.push({
      id: uuidv4(),
      name: name,
    })
  }

  const toogleTask = (projectId: string, taskId: string) => {
    const project = projects.value.find(project => project.id === projectId);
    if (!project) return;

    const task = project.tasks.find(task => task.id === taskId);
    if (!task) return;

    task.completedAt = task.completedAt ? undefined : new Date();
  }

  return {
    // Properties
    projects,

    // Getters
    projectList: computed(() => [...projects.value]),
    noProjects: computed(() => projects.value.length === 0),

    projectsWithCompletion: computed(() => {
      return projects.value.map(project => {
        const completedTasks = project.tasks.filter(task => !!task.completedAt).length;
        const totalTasks = project.tasks.length;
        const completion = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

        return {
          ...project,
          taskCount: totalTasks,
          completion: Math.round(completion),
        };
      });
    }),

    // Actions
    addProject,
    addTaskProject,
    toogleTask
  };
});
