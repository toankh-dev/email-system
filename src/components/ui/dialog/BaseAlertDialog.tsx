'use client';

import React from 'react';

// GlobalAlertDialog.tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../alert/AlertDialog';
import { useAppStore } from '@/stores';
// stores

export function BaseAlertDialog() {
  // Select multiple properties from the store in one selector for efficiency
  const dialogState = useAppStore(state => ({
    open: state.open,
    title: state.title,
    description: state.description,
    cancelLabel: state.cancelLabel,
    actionLabel: state.actionLabel,
    onAction: state.onAction,
    onCancel: state.onCancel,
    closeConfirm: state.closeConfirm,
  }));

  const { open, title, description, cancelLabel, actionLabel, onAction, onCancel, closeConfirm } = dialogState;

  return (
    <AlertDialog open={open} onOpenChange={closeConfirm}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction onClick={onAction}>{actionLabel}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
