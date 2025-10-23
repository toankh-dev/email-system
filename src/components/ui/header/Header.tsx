'use client';

import React, { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { ChevronDown, ChevronUp, X, SlidersVertical, Bell, MessageCircleMore, Presentation } from 'lucide-react';
import Image from 'next/image';

//components
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { BaseToolTip } from '../tooltip';
import { Button } from '../button';

export const Header: React.FC = React.memo(() => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [openLetter, setOpenLetter] = useState(false);
  const [searchQuery, setSearchQuery] = useState('status:open');

  const refDropdown = useRef<HTMLDivElement>(null);

  // Toggle dropdown
  const toggleDropdown = () => {
    setOpenLetter(!openLetter);
    setShowDropdown(prev => !prev);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (refDropdown.current && !refDropdown.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header id="global-app-bar" className="flex items-center justify-between p-2">
      <div ref={refDropdown} className="flex">
        <div className="flex h-10 w-52 items-center justify-between rounded-sm bg-stone-400/10 px-3 text-[14px]">
          <div className="text-gray-600">全員共有の受信箱</div>
          <div onClick={toggleDropdown} className="cursor-pointer">
            {openLetter ? <ChevronUp className="h-5" /> : <ChevronDown className="h-5" />}
          </div>
          <div
            className={clsx(
              'absolute top-full left-4 z-10 w-50 origin-top rounded-sm border border-gray-200 bg-[#F3F4F6] text-sm text-gray-600 shadow-md transition-all duration-200 ease-out',
              showDropdown
                ? 'translate-x-0 translate-y-0 scale-100 opacity-100'
                : 'pointer-events-none -translate-x-2 -translate-y-2 scale-75 opacity-0'
            )}
          >
            <ul className="px-1 py-2">
              <li className="flex cursor-pointer items-center gap-2 px-4 py-1 hover:bg-gray-100">全員共有の受信箱</li>
            </ul>
          </div>
        </div>
        <div className="flex h-10 w-100 items-center justify-between rounded-sm bg-stone-300/10 px-3 text-[14px] text-gray-500">
          <Input
            className="border-none shadow-none placeholder:text-black focus-visible:ring-0 focus-visible:outline-none"
            placeholder="status:open"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <div className="flex items-center">
            <X className="h-5" onClick={() => setSearchQuery('')} />
            <SlidersVertical className="h-5" />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 text-gray-500">
        <BaseToolTip contentProps={{ children: '掲示板' }}>
          <Button variant="ghost" className="h-10 w-10 justify-center rounded">
            <Presentation className="h-5! w-5!" />
          </Button>
        </BaseToolTip>
        <BaseToolTip contentProps={{ children: '通知' }}>
          <Button variant="ghost" className="h-10 w-10 justify-center rounded">
            <Bell className="h-5! w-5!" />
          </Button>
        </BaseToolTip>
        <BaseToolTip contentProps={{ children: '新着チャット' }}>
          <Button variant="ghost" className="h-10 w-10 justify-center rounded">
            <MessageCircleMore className="h-5! w-5!" />
          </Button>
        </BaseToolTip>
        <Button variant="ghost" className="h-10 w-10 justify-center rounded">
          <Avatar>
            <Image width={34} height={34} src="https://github.com/shadcn.png" alt="@user" />
          </Avatar>
        </Button>
      </div>
    </header>
  );
});

Header.displayName = 'Header';
