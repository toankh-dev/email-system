import { StateCreator } from 'zustand';

export interface HeaderValues {
  checkedItems: { [id: string]: boolean };
  isAllChecked: boolean;
  sortBy: 'updated' | 'created';
  sortOrder: 'desc' | 'asc';
}

export interface HeaderAction {
  setCheckedItem: (id: number, checked: boolean) => void;
  setAllChecked: (checked: boolean) => void;
  setSortBy: (sortBy: 'updated' | 'created') => void;
  setSortOrder: (sortOrder: 'desc' | 'asc') => void;
}

export type HeaderState = HeaderValues & HeaderAction;

export const createHeaderSlice: StateCreator<HeaderState> = set => ({
  checkedItems: {},
  isAllChecked: false,
  sortBy: 'updated',
  sortOrder: 'desc',
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
      Object.keys(state.checkedItems).forEach(id => {
        newCheckedItems[id] = checked;
      });

      return {
        ...state,
        checkedItems: newCheckedItems,
        isAllChecked: checked,
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
