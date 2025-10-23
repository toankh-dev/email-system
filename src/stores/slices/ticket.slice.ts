import { IPaginationList } from '@/types/pagination';
import { ITicket } from '@/types/TicketType';
import { StateCreator } from 'zustand';

export interface TicketValues {
  data: ITicket[];
  total: number;
  pageIndex: number;
  pageSize: number;
  isAllChecked: boolean;
  checkedItems: { [id: string]: boolean };
  sortBy: 'updated' | 'created';
  sortOrder: 'desc' | 'asc';
}

export interface TicketActions {
  storeTickets: (tickets: IPaginationList<ITicket>) => void;
  setCheckedItem: (id: number, checked: boolean) => void;
  setAllChecked: (checked: boolean) => void;
  setSortBy: (sortBy: 'updated' | 'created') => void;
  setSortOrder: (sortOrder: 'desc' | 'asc') => void;
  next: () => void;
  previous: () => void;
}

export type TicketSliceState = TicketValues & TicketActions;

export const createTicketSlice: StateCreator<TicketSliceState> = set => ({
  loading: true,
  data: [],
  total: 0,
  pageIndex: 0,
  pageSize: 20,
  checkedItems: {},
  isAllChecked: false,
  sortBy: 'updated',
  sortOrder: 'desc',
  storeTickets: data => {
    set(state => {
      return {
        ...state,
        checkedItems: {},
        data: data.data,
        total: data.total,
      };
    });
  },
  setCheckedItem: (id: number, checked: boolean) => {
    set(state => {
      const newCheckedItems = { ...state.checkedItems, [id]: checked };
      const allChecked = Object.values(newCheckedItems).every(Boolean) && Object.keys(newCheckedItems).length > 0;

      return {
        ...state,
        checkedItems: newCheckedItems,
        isAllChecked: allChecked,
      };
    });
  },
  setAllChecked: (checked: boolean) => {
    set(state => {
      // Initialize a new object to avoid reference issues
      const newCheckedItems: { [id: string]: boolean } = {};

      // Apply the state to all existing IDs
      state.data.forEach(ticket => {
        newCheckedItems[ticket.id] = checked;
      });

      return {
        ...state,
        checkedItems: newCheckedItems,
        isAllChecked: checked,
      };
    });
  },
  next: () => {
    set(state => {
      const nextPage = state.pageIndex + 1;
      if (nextPage > Math.ceil(state.total / state.pageSize) - 1) return state; // Prevent going beyond the last page
      return {
        ...state,
        pageIndex: nextPage,
        checkedItems: {}, // Reset checked items when changing page
        isAllChecked: false, // Reset all checked state when changing page
      };
    });
  },
  previous: () => {
    set(state => {
      const previousPage = state.pageIndex - 1;
      if (previousPage < 0) return state; // Prevent going beyond the first page
      return {
        ...state,
        pageIndex: previousPage,
        checkedItems: {}, // Reset checked items when changing page
        isAllChecked: false, // Reset all checked state when changing page
      };
    });
  },
  setSortBy: (sortBy: 'updated' | 'created') => {
    set(state => ({
      ...state,
      sortBy,
    }));
  },
  setSortOrder: (sortOrder: 'desc' | 'asc') => {
    set(state => ({
      ...state,
      sortOrder,
    }));
  },
});
