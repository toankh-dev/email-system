import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { createTicketSlice, TicketActions, TicketValues } from './slices/ticket.slice';

interface TicketState extends TicketValues, TicketActions {}

const combineSlices =
  <T extends object>(...slices: AppStateCreator<T>[]): AppStateCreator<T> =>
  (set, get, api) => {
    return Object.assign({}, ...slices.map(slice => slice(set, get, api)));
  };

export const useTicketStore = create<TicketState>()(
  devtools(
    persist(
      immer((set, get, api) => combineSlices(createTicketSlice)(set, get, api)),
      {
        name: 'ticket-storage',
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);
