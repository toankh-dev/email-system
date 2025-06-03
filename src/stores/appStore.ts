import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

import { createHeaderSlice, HeaderState } from './slices/header.slice';
import { createUISlice, UIState } from './slices/uiSlice';
import { createDialogSlice, DialogSliceState } from './slices/dialog.slice';
import { createNavSlice, NavState } from './slices/navigation.slice';

interface AppState extends DialogSliceState, HeaderState, UIState, NavState {}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      immer((set, get, api) => ({
        ...createUISlice(set as any, get as any, api as any),
        ...createDialogSlice(set as any, get as any, api as any),
        ...createHeaderSlice(set as any, get as any, api as any),
        ...createNavSlice(set as any, get as any, api as any),
      })),
      {
        name: 'app-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: state => ({
          current: state.current,
          previous: state.previous,
        }),
      }
    )
  )
);
