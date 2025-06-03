'use client';

import { Bell, Presentation } from 'lucide-react';
import Image from 'next/image';

//components
import { Avatar } from '@/components/ui/avatar';
import { Button } from '../button';
import { BaseToolTip } from '../tooltip';

export const SettingHeader: React.FC = () => {
  return (
    <header id="global-app-bar" className="flex items-center justify-between p-2">
      <div className="flex-grow-1"></div>
      <div className="flex items-center gap-2 text-gray-500">
        <BaseToolTip contentProps={{ children: '掲示板' }}>
          <Button variant="ghost" className="h-10 w-10 rounded">
            <Presentation className="h-5! w-5!" />
          </Button>
        </BaseToolTip>
        <BaseToolTip contentProps={{ children: '通知' }}>
          <Button variant="ghost" className="h-10 w-10 rounded">
            <Bell className="h-5! w-5!" />
          </Button>
        </BaseToolTip>
        <Button variant="ghost" className="h-10 w-10 rounded">
          <Avatar>
            <Image width={34} height={34} src="https://github.com/shadcn.png" alt="@user" />
          </Avatar>
        </Button>
      </div>
    </header>
  );
};
