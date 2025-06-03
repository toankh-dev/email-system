import { StateCreator } from 'zustand';

// Ensure we have the same global interface definition
declare global {
  type AppStateCreator<T> = StateCreator<T, [['zustand/devtools', never], ['zustand/persist', unknown], ['zustand/immer', never]], []>;
}
