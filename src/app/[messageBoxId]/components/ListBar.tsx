'use client';

import { useEffect, useRef, useState } from 'react';

import BasePagination from '@/components/Paginations';
import { Button } from '@/components/ui/button';
import { useTicketStore } from '@/stores';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import clsx from 'clsx';
import {
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  CheckIcon,
  ChevronDown,
  HardDriveDownload,
  MinusIcon,
  PanelBottomClose,
  RotateCw,
} from 'lucide-react';
import { MdSort } from 'react-icons/md';
import { BaseToolTip } from '../../../components/ui/tooltip';
// hooks/api
import { TicketStatus } from '@/constants/ticket';
import { useQueryPop3 } from '@/hooks/api/usePop3';
import { useInvalidateTickets } from '@/hooks/api/useTicket';
import { toast } from 'sonner';

interface Props {
  status: TicketStatus;
}

const ListBar = (props: Props) => {
  const { status } = props;
  const [showDropdown1, setShowDropdown1] = useState(false);
  const [showDropdown2, setShowDropdown2] = useState(false);

  const refDropdown1 = useRef<HTMLDivElement>(null);
  const refDropdown2 = useRef<HTMLDivElement>(null);

  // Use the store values with fallbacks for initial render
  const sortBy = useTicketStore(state => state.sortBy);
  const sortOrder = useTicketStore(state => state.sortOrder);
  const checkedItems = useTicketStore(state => state.checkedItems);
  const pageIndex = useTicketStore(state => state.pageIndex);
  const pageSize = useTicketStore(state => state.pageSize);
  const total = useTicketStore(state => state.total);
  const next = useTicketStore(state => state.next);
  const previous = useTicketStore(state => state.previous);

  // Store actions
  const setSortBy = useTicketStore(state => state.setSortBy);
  const setSortOrder = useTicketStore(state => state.setSortOrder);
  const setAllChecked = useTicketStore(state => state.setAllChecked);
  const checkedValues = Object.values(checkedItems);
  const isAllChecked = checkedValues.length > 0 && checkedValues.every(Boolean);
  const isIndeterminate = checkedValues.some(Boolean) && !checkedValues.every(Boolean);

  const { mutateAsync: fetchMail } = useQueryPop3({ message_box_id: '1' });
  const invalidateTickets = useInvalidateTickets({ status, pageIndex, pageSize });

  // Toggle dropdown
  const toggleDropdown1 = () => {
    setShowDropdown1(prev => !prev);
  };

  const toggleDropdown2 = () => {
    setShowDropdown2(prev => !prev);
  };

  const handleFetchMailByPop3 = async () => {
    setShowDropdown1(false);

    try {
      await fetchMail();
      toast.success('メールを正常に取得しました。\n新しいデータを表示するにはリロードしてください。');
    } catch (_) {
      // Error is already handled by the mutation hook
      toast.error('メールの取得に失敗しました。');
    } finally {
      setShowDropdown1(false);
    }
  };

  const handleRefetchTickets = () => {
    invalidateTickets();
    setShowDropdown1(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (refDropdown1.current && !refDropdown1.current.contains(event.target as Node)) {
        setShowDropdown1(false);
      }
      if (refDropdown2.current && !refDropdown2.current.contains(event.target as Node)) {
        setShowDropdown2(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="h-full w-full">
      <div className="flex h-full items-center justify-between pl-4 shadow-sm">
        {/* Checkbox */}
        <div className="flex items-center">
          <div className="pr-5">
            <CheckboxPrimitive.Root
              checked={isAllChecked}
              onCheckedChange={val => setAllChecked(Boolean(val))}
              className={clsx(
                'flex h-3.5 w-3.5 cursor-pointer items-center justify-center rounded-xs shadow ring-[1.8px] ring-[#767676] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
                {
                  'border-green-600 bg-green-600 ring-green-600': isAllChecked,
                  'border-[#767676] bg-[#767676] ring-[#767676]': isIndeterminate,
                  'border-gray-500 bg-white': !isAllChecked && !isIndeterminate,
                }
              )}
            >
              <CheckboxPrimitive.Indicator forceMount>
                {isIndeterminate ? (
                  <MinusIcon className="h-3 w-3 text-[#F6F5DB]" />
                ) : isAllChecked ? (
                  <CheckIcon className="h-3 w-3 text-[#F6F5DB]" />
                ) : null}
              </CheckboxPrimitive.Indicator>
            </CheckboxPrimitive.Root>
          </div>
          <div className="flex items-center">
            <BaseToolTip contentProps={{ children: 'チケット一覧を更新' }}>
              <Button variant="ghost" className="h-8 w-7 justify-center" onClick={handleRefetchTickets}>
                <RotateCw className="h-5! w-5! text-gray-500" />
              </Button>
            </BaseToolTip>
            {/* Chevron + Dropdown */}
            <div className="relative" ref={refDropdown1}>
              <div onClick={toggleDropdown1} className="cursor-pointer">
                <Button variant="ghost" className="flex items-center">
                  <ChevronDown className="w-4 text-gray-500" />
                </Button>
              </div>

              {/* Dropdown menu */}
              <div
                className={clsx(
                  'absolute top-full left-0 z-10 mt-2 w-[300px] origin-top-left rounded-sm border border-gray-200 bg-zinc-50 text-sm text-gray-500 shadow-md transition-all duration-200 ease-out',
                  showDropdown1
                    ? 'translate-x-0 translate-y-0 scale-100 opacity-100'
                    : 'pointer-events-none -translate-x-2 -translate-y-2 scale-75 opacity-0'
                )}
              >
                <ul className="px-1 py-2">
                  <BaseToolTip
                    contentProps={{
                      children: 'チケット一覧を更新',
                      side: 'right',
                      align: 'end',
                    }}
                  >
                    <li className="cursor-pointer px-4 py-1 hover:bg-gray-100" onClick={handleRefetchTickets}>
                      <Button variant="ghost" className="flex cursor-pointer items-center gap-2 disabled:opacity-50">
                        <RotateCw className="h-5! w-5! text-gray-500" />
                        <div className="text-xs">チケット一覧を更新</div>
                      </Button>
                    </li>
                  </BaseToolTip>
                  <BaseToolTip
                    contentProps={{
                      children: '今すぐPOP3サーバから受信',
                      side: 'right',
                      align: 'end',
                    }}
                  >
                    <li className="cursor-pointer px-4 py-1 hover:bg-gray-100" onClick={handleFetchMailByPop3}>
                      <Button variant="ghost" className="flex cursor-pointer items-center gap-2 disabled:opacity-50">
                        <HardDriveDownload className="h-5! w-5! text-gray-500" />
                        <div className="text-xs">今すぐPOP3サーバから受信</div>
                      </Button>
                    </li>
                  </BaseToolTip>
                  <BaseToolTip
                    contentProps={{
                      children: '今すぐYahoo! 問い合わせ管理を受信',
                      side: 'right',
                      align: 'end',
                    }}
                  >
                    <li className="cursor-pointer px-4 py-1 hover:bg-gray-100">
                      <Button disabled variant="ghost" className="flex cursor-pointer items-center gap-2 disabled:opacity-50">
                        <PanelBottomClose className="h-5! w-5! text-gray-500" />
                        <div className="text-xs">今すぐYahoo! 問い合わせ管理を受信</div>
                      </Button>
                    </li>
                  </BaseToolTip>
                  <BaseToolTip
                    contentProps={{
                      children: '今すぐChatworkのチャットを受信',
                      side: 'right',
                      align: 'end',
                    }}
                  >
                    <li className="cursor-pointer px-4 py-1 hover:bg-gray-100">
                      <Button disabled variant="ghost" className="flex items-center gap-2 disabled:opacity-50">
                        <PanelBottomClose className="h-5! w-5! text-gray-500" />
                        <div className="text-xs">今すぐChatworkのチャットを受信</div>
                      </Button>
                    </li>
                  </BaseToolTip>
                </ul>
              </div>
            </div>
          </div>
          <div className="ml-2 flex items-center">
            <BaseToolTip
              contentProps={{
                children: (
                  <div className="px-1.5 py-0.5 text-xs">
                    <div>
                      並び替え基準: <span className="pl-[5px]">チケットの最終更新日時 | 古い順</span>
                    </div>
                    <div>
                      順序: <span className="pl-[53px]">古い順</span>
                    </div>
                  </div>
                ),
              }}
            >
              <Button variant="ghost" className="h-8 w-7 justify-center">
                <MdSort className="!h-5 !w-5 text-gray-500" />
              </Button>
            </BaseToolTip>
            {/* Chevron + Dropdown */}
            <div className="relative" ref={refDropdown2}>
              <div onClick={toggleDropdown2} className="cursor-pointer">
                <Button variant="ghost" className="flex items-center">
                  <ChevronDown className="w-4 text-gray-500" />
                </Button>
              </div>

              {/* Dropdown menu */}
              <div
                className={clsx(
                  'absolute top-full left-0 z-10 mt-2 w-[200px] origin-top-left rounded-sm border border-gray-200 bg-zinc-50 text-sm text-gray-500 shadow-md transition-all duration-200 ease-out',
                  showDropdown2
                    ? 'translate-x-0 translate-y-0 scale-100 opacity-100'
                    : 'pointer-events-none -translate-x-2 -translate-y-2 scale-75 opacity-0'
                )}
              >
                <ul className="py-1 font-medium text-gray-800">
                  <li className="flex items-center gap-2 px-4 py-2 font-semibold text-gray-500">並び替え基準</li>
                  <li
                    className={clsx(
                      'flex cursor-pointer items-center gap-2 px-4 py-2 hover:bg-gray-100',
                      sortBy === 'updated' && 'bg-green-100 font-medium text-green-600'
                    )}
                    onClick={() => setSortBy('updated')}
                  >
                    チケットの最終更新日時
                  </li>
                  <li
                    className={clsx(
                      'flex cursor-pointer items-center gap-2 px-4 py-2 hover:bg-gray-100',
                      sortBy === 'created' && 'bg-green-100 font-medium text-green-600'
                    )}
                    onClick={() => setSortBy('created')}
                  >
                    チケットの作成日時
                  </li>
                  <hr />
                  <li className="flex items-center gap-2 px-4 py-2 font-semibold text-gray-500">順序</li>
                  <li
                    className={clsx(
                      'flex cursor-pointer items-center gap-2 px-4 py-2 hover:bg-gray-100',
                      sortOrder === 'desc' && 'bg-green-100 font-medium text-green-600'
                    )}
                    onClick={() => setSortOrder('desc')}
                  >
                    <ArrowDownWideNarrow /> 新しい順
                  </li>
                  <li
                    className={clsx(
                      'flex cursor-pointer items-center gap-2 px-4 py-2 hover:bg-gray-100',
                      sortOrder === 'asc' && 'bg-green-100 font-medium text-green-600'
                    )}
                    onClick={() => setSortOrder('asc')}
                  >
                    <ArrowUpNarrowWide /> 古い順
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div>
          <BasePagination pageIndex={pageIndex} pageSize={pageSize} total={total} nextPage={next} previousPage={previous} />
        </div>
      </div>
    </div>
  );
};

export default ListBar;
