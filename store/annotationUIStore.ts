import { create } from "zustand";
import type { Point } from "@/types/types";

interface AnnotationUIState {
  activeImageId: number | null;
  draftPoints: Point[];
  selectedAnnotationId: number | null;
  setActiveImage: (id: number | null) => void;
  addDraftPoint: (point: Point) => void;
  resetDraft: () => void;
  selectAnnotation: (id: number | null) => void;
}

export const useAnnotationUIStore = create<AnnotationUIState>((set) => ({
  activeImageId: null,
  draftPoints: [],
  selectedAnnotationId: null,
  setActiveImage: (id) =>
    set({ activeImageId: id, draftPoints: [], selectedAnnotationId: null }),
  addDraftPoint: (point) =>
    set((s) => ({ draftPoints: [...s.draftPoints, point] })),
  resetDraft: () => set({ draftPoints: [] }),
  selectAnnotation: (id) => set({ selectedAnnotationId: id }),
}));
