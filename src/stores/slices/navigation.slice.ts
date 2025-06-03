import { StateCreator } from 'zustand';

export interface NavState {
  current: string | null;
  previous: string | null;
  setPath(path: string): void;
}

export const createNavSlice: StateCreator<NavState> = (set, get) => ({
  current: null,
  previous: null,
  setPath: (path: string) => {
    set({
      previous: get().current,
      current: path,
    });
  },
});
