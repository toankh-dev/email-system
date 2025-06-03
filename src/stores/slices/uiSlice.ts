import { StateCreator } from 'zustand';

export interface UIValues {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export type UIState = UIValues;

export const createUISlice: StateCreator<UIState> = set => ({
  sidebarOpen: false,
  toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),
});
