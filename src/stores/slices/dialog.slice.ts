import { StateCreator } from 'zustand';

export interface DialogValues {
  open: boolean;
  title: string | null;
  description: string | null;
  cancelLabel: string | null;
  actionLabel: string | null;
  onAction: () => void;
  onCancel: () => void;
}

export interface DialogActions {
  confirm: (data: {
    title: string;
    description: string;
    cancelLabel: string;
    actionLabel: string;
    onAction: () => void;
    onCancel: () => void;
  }) => void;
  closeConfirm: () => void;
}

export type DialogSliceState = DialogValues & DialogActions;

export const createDialogSlice: StateCreator<DialogSliceState> = set => ({
  open: false,
  title: null,
  description: null,
  cancelLabel: null,
  actionLabel: null,
  onAction: () => {},
  onCancel: () => {},
  confirm: data =>
    set(() => ({
      open: true,
      title: data.title,
      description: data.description,
      cancelLabel: data.cancelLabel,
      actionLabel: data.actionLabel,
      onAction: data.onAction,
      onCancel: data.onCancel,
    })),
  closeConfirm: () =>
    set(() => ({
      open: false,
      title: null,
      description: null,
      cancelLabel: null,
      actionLabel: null,
      onAction: () => {},
      onCancel: () => {},
    })),
});
