'use client';
import React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';

// components
import { DialogHeader, DialogFooter, Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from './Dialog';
import { Button } from '../button';

interface BaseDialogProps {
  title: string | React.ReactNode;
  openTitleButton?: string | React.ReactNode;
  description?: string | React.ReactNode;
  dialogProps?: React.ComponentProps<typeof DialogPrimitive.Root>;
  dialogTitleProps?: React.ComponentProps<typeof DialogTitle>;
  dialogContentProps?: React.ComponentProps<typeof DialogContent>;
  dialogDescriptionProps?: React.ComponentProps<typeof DialogDescription>;
  dialogTriggerProps?: React.ComponentProps<typeof DialogTrigger>;

  openButtonProps?: React.ComponentProps<'button'>;
  actionComponent?: React.ReactNode;
  children?: React.ReactNode;
}

const BaseDialog: React.FC<BaseDialogProps> = props => {
  const {
    title,
    description,
    dialogProps = {},
    dialogTitleProps = {},
    dialogContentProps = {},
    dialogDescriptionProps = {},
    dialogTriggerProps = {},

    actionComponent,
    openButtonProps = {},
    children,
  } = props ?? {};

  return (
    <Dialog {...dialogProps}>
      <DialogTrigger asChild {...dialogTriggerProps}>
        <Button className="btn btn-primary" {...openButtonProps} />
      </DialogTrigger>
      <DialogContent {...dialogContentProps}>
        <DialogHeader>
          {title && <DialogTitle {...dialogTitleProps}>{title}</DialogTitle>}
          {description && <DialogDescription {...dialogDescriptionProps}>{description}</DialogDescription>}
        </DialogHeader>
        {children}
        {actionComponent ? (
          <DialogFooter>
            <DialogTrigger asChild>{actionComponent}</DialogTrigger>
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default BaseDialog;
