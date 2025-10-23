'use client';

import { ROUTES } from '@/constants';
import { formatString } from '@/lib/client';
import { MoreVertical, Search, Star } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { AiTwotoneContainer } from 'react-icons/ai';
import { FiList } from 'react-icons/fi';
import { HiArrowsUpDown } from 'react-icons/hi2';
import { IoIosSettings } from 'react-icons/io';
import Typography from './Typography';
import { Button } from './ui/button';
import { BaseToolTip } from './ui/tooltip';

const PopupInbox: React.FC = () => {
  const [isStarred, setIsStarred] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isFilterActive, setIsFilter] = useState(false);
  const [showOptionsMenu, setShowOpt] = useState(false);
  const [isOptionsAnimating, setIsOptionsAnimating] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (!showOptionsMenu) {
      setIsOptionsAnimating(false);
      return;
    }
    setTimeout(() => setIsOptionsAnimating(true), 10);
  }, [showOptionsMenu]);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (e.button !== 0) return;
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setIsOptionsAnimating(false);
        setTimeout(() => setShowOpt(false), 300);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const handleNavigate = () => {
    window.location.href = formatString(ROUTES.TICKETS_OPEN, {
      params: { messageBoxId: '1' },
    });
  };

  return (
    <div className="relative h-full w-full">
      <div className="pointer-events-none absolute top-6 -left-2 h-0 w-0 border-t-8 border-r-8 border-b-8 border-t-transparent border-r-white border-b-transparent" />

      <div className="w-[315px] overflow-visible rounded-sm bg-white shadow-lg">
        <div className="border-b border-gray-200 p-3">
          <div className="flex items-center gap-3">
            <div className="relative h-[41px] w-[210px] rounded-sm border border-gray-300 bg-gray-100 transition focus-within:border-green-600 focus-within:bg-white">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                ref={inputRef}
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                placeholder="受信箱を検索"
                className="h-full w-full rounded-sm bg-transparent pr-3 pl-10 text-sm text-gray-600 outline-none"
              />
            </div>

            <div className="relative flex items-center gap-1">
              <BaseToolTip
                contentProps={{
                  children: isFilterActive ? 'すべての受信箱を表示する' : 'お気に入りの受信箱だけを表示する',
                }}
              >
                <button
                  onClick={() => setIsFilter(s => !s)}
                  aria-pressed={isFilterActive}
                  className="cursor-pointer rounded-full p-2 transition focus:outline-none"
                >
                  <FiList
                    className={`h-5 w-5 cursor-pointer transition ${
                      isFilterActive ? 'text-green-600' : 'text-gray-600 hover:text-green-600'
                    }`}
                  />
                </button>
              </BaseToolTip>

              <Button
                onClick={() => setShowOpt(v => !v)}
                aria-expanded={showOptionsMenu}
                className="cursor-pointer rounded-full p-2 transition hover:bg-gray-100 focus:outline-none"
              >
                <MoreVertical className="h-5 w-5 cursor-pointer text-gray-600" />
              </Button>
              <div
                ref={popupRef}
                className={`absolute right-0 z-10 mt-2 w-43 origin-top-right transform rounded-lg bg-white py-1 shadow-xl transition-all duration-300 ease-out ${
                  isOptionsAnimating ? 'pointer-events-auto scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0'
                }`}
              >
                <div className="flex cursor-pointer items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <HiArrowsUpDown className="mr-2 h-4 w-4 cursor-pointer text-gray-600" />
                  <span>受信箱の順序変更</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-full items-start border-b border-gray-200 p-2 transition hover:bg-gray-50">
          <BaseToolTip
            contentProps={{
              children: isStarred ? 'お気に入りをはずす' : 'お気に入りにする',
            }}
          >
            <button
              onClick={e => {
                e.stopPropagation();
                setIsStarred(s => !s);
              }}
              aria-pressed={isStarred}
              className="mr-2 cursor-pointer rounded-full transition focus:outline-none"
            >
              <div className="flex items-center justify-center rounded-full p-2 transition hover:bg-gray-100">
                <Star
                  className={`h-4 w-4 cursor-pointer transition ${
                    isStarred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-400'
                  }`}
                />
              </div>
            </button>
          </BaseToolTip>

          <div onClick={handleNavigate} className="flex flex-1 cursor-pointer flex-col items-start">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 cursor-pointer items-center justify-center rounded">
                <AiTwotoneContainer className="h-4 w-4 text-green-600" />
              </div>
              <Typography variant="span" size="md" color="text-gray-800" className="cursor-pointer whitespace-nowrap">
                全員共有の受信箱 (Test)
              </Typography>
              <Link
                href={formatString(ROUTES.TICKET_SETTINGS_MAIL_RECEIVE, {
                  params: { messageBoxId: '1' },
                })}
                onClick={e => {
                  e.stopPropagation();
                }}
                className="ml-5 cursor-pointer rounded-full transition hover:bg-gray-200 focus:outline-none"
                prefetch={true}
              >
                <IoIosSettings className="h-6 w-6 cursor-pointer text-gray-600" />
              </Link>
            </div>
            <Typography
              variant="span"
              size="sm"
              color="text-gray-600"
              className="inline-flex items-center self-start rounded-sm bg-gray-100 px-1 py-0.5"
            >
              未対応 0
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupInbox;
