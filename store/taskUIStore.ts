import { create } from "zustand";

interface TaskUIState {
  selectedDate: string | null;
  activeTaskId: number | null;
  isModalOpen: boolean;
  setSelectedDate: (date: string | null) => void;
  openTaskModal: (taskId?: number) => void;
  closeTaskModal: () => void;
}

export const useTaskUIStore = create<TaskUIState>((set) => ({
  selectedDate: null,
  activeTaskId: null,
  isModalOpen: false,
  setSelectedDate: (date) => set({ selectedDate: date }),
  openTaskModal: (taskId) =>
    set({ isModalOpen: true, activeTaskId: taskId ?? null }),
  closeTaskModal: () => set({ isModalOpen: false, activeTaskId: null }),
}));
