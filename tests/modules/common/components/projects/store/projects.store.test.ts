import { useProjectsStore } from '@/modules/projects/store/projects.store';
import { createPinia, setActivePinia } from 'pinia';
import { fakeProjects } from '@tests/mocks/projects.fake';

describe('useProjectsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
  });

  test('should return default values', () => {
    const {
      noProjects,
      projectList,
      projects,
      projectsWithCompletion,
      addProject,
      addTaskProject,
      toogleTask,
    } = useProjectsStore();

    expect(noProjects).toBe(true);
    expect(projectList).toEqual([]);
    expect(projects).toEqual([]);
    expect(projectsWithCompletion).toEqual([]);
    expect(addProject).toBeInstanceOf(Function);
    expect(addTaskProject).toBeInstanceOf(Function);
    expect(toogleTask).toBeInstanceOf(Function);
  });

  test('add a project - action', () => {
    const store = useProjectsStore();
    const newProjectName = 'New project';

    store.addProject(newProjectName);

    expect(store.projects.length).toBe(1);
    expect(store.projects[0]).toEqual({
      id: expect.any(String),
      name: newProjectName,
      tasks: [],
    });
  });

  test('should load from localStorage', () => {
    localStorage.setItem('projects', JSON.stringify(fakeProjects));

    const store = useProjectsStore();

    store.projectList.forEach((project, index) => {
      expect(project).toEqual(JSON.parse(JSON.stringify(fakeProjects[index])));
    });

    expect(store.projects.length).toBe(fakeProjects.length);
  });

  test('add a task to a project', () => {
    const store = useProjectsStore();
    store.addProject('New Project');
    const project = store.projectList[0];

    const taskName = 'New Task';

    store.addTaskProject(taskName, project?.id);

    expect(project.tasks.length).toBe(1);
    expect(project.tasks.at(0)).toEqual({
      id: expect.any(String),
      name: taskName,
      completedAt: undefined,
    });
  });

  test('toggles a task', () => {
    const store = useProjectsStore();
    store.addProject('New Project');
    const project = store.projectList[0];

    const taskName = 'New Task';

    store.addTaskProject(taskName, project?.id);

    const task = project.tasks.at(0)!;

    store.toogleTask(project.id, task.id);

    expect(project.tasks.at(0)).toEqual({
      id: expect.any(String),
      name: taskName,
      completedAt: expect.any(Date),
    });
  });

  test('should return the projects with completion', () => {
    const store = useProjectsStore();
    store.$patch(state => {
      state.projects = fakeProjects;
    });

    const expectedProjects = store.projects.map(project => {
      const completedTasks = project.tasks.filter(
        task => !!task.completedAt,
      ).length;
      const totalTasks = project.tasks.length;
      const completion =
        totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

      return {
        ...project,
        taskCount: totalTasks,
        completion: Math.round(completion),
      };
    });

    expect(store.projectsWithCompletion).toEqual(expectedProjects);
  });
});
