import { create } from 'zustand';
import { persist, devtools, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { StateCreator } from 'zustand';

/**
 * Auth Store
 *
 * IMPORTANT: Token is NOT stored here anymore for security reasons.
 * Token is stored in httpOnly cookies and managed server-side.
 *
 * This store only manages user information (name, email, id, etc.)
 * that is safe to store client-side.
 */

export interface User {
  id: number;
  name: string;
  email?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  clearAuth: () => void;
}

export const createAuthSlice: StateCreator<AuthState> = set => ({
  user: null,
  isAuthenticated: false,
  setUser: user =>
    set(state => ({
      ...state,
      user,
      isAuthenticated: !!user,
    })),
  clearAuth: () =>
    set(state => ({
      ...state,
      user: null,
      isAuthenticated: false,
    })),
});

const combineSlices =
  <T extends object>(...slices: AppStateCreator<T>[]): AppStateCreator<T> =>
  (set, get, api) => {
    return Object.assign({}, ...slices.map(slice => slice(set, get, api)));
  };

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      immer((set, get, api) => ({
        ...combineSlices(createAuthSlice)(set, get, api),
      })),
      {
        name: 'auth-storage',
        storage: createJSONStorage(() => sessionStorage),
        // Only persist user info, NOT the token
        partialize: state => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    )
  )
);
