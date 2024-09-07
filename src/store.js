import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useTaskStore = create(
  persist(
    (set) => ({
      tasks: [],

      // add a new task
      addTask: (task) =>
        set((state) => ({
          tasks: [...state.tasks, task],
        })),

      // edit an exisiting task
      editTask: (id, updatedTask) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updatedTask } : task
          ),
        })),

      // delete a task
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),

      // toggle task status
      toggleTaskStatus: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
          ),
        })),
    }),
    {
      name: "task-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
);

export default useTaskStore;
