'use client';

import React from 'react';

import { Tooltip, TooltipContent, TooltipTrigger } from './Tooltip';

interface BaseToolTipProps {
  children: React.ReactNode;
  contentProps: React.ComponentProps<typeof TooltipContent>;
}

export const BaseToolTip: React.FC<BaseToolTipProps> = props => {
  const { children, contentProps } = props;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent {...contentProps} />
    </Tooltip>
  );
};
