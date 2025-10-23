'use client';

import React from 'react';
import { Inbox, Send, ChevronDown, Clock3, X, Check, WalletCards, Settings, ListTodo } from 'lucide-react';
// components
import { BaseToolTip } from '../tooltip';
import { ActiveLink } from '../link';
import { Button } from '@/components/ui/button';
//types
import { SidebarListType } from '@/types/sidebar';
import { ROUTES } from '@/constants';
import { formatString, openCenteredPopup } from '@/lib/client';

export const TicketSidebar: React.FC = React.memo(() => {
  const sidebarItems: Array<SidebarListType> = [
    {
      group: 'main',
      items: [
        {
          key: 'tickets/open/p1',
          label: '未対応',
          activeClassName: 'bg-[#D7E7F3]',
          icon: <Inbox className="mr-2 h-4 w-4 text-sky-600" />,
          href: formatString(ROUTES.TICKETS_OPEN, {
            params: { messageBoxId: '1' },
          }),
        },
        {
          key: 'tickets/pending/p1',
          label: '保留',
          activeClassName: 'bg-[#F8E7D3]',
          icon: <Clock3 className="mr-2 h-4 w-4 text-orange-500" />,
          href: formatString(ROUTES.TICKETS_PENDING, {
            params: { messageBoxId: '1' },
          }),
        },
        {
          key: 'tickets/reason/-1/p1',
          label: '（保留理由なし）',
          activeClassName: 'bg-[#F8E7D3]',
          href: formatString(ROUTES.TICKETS_REASON, {
            params: {
              messageBoxId: '1',
              reasonId: '-1',
            },
          }),
        },
        {
          key: 'tickets/reason/1/p1',
          label: 'スヌーズ中',
          activeClassName: 'bg-[#F8E7D3]',
          href: formatString(ROUTES.TICKETS_REASON, {
            params: {
              messageBoxId: '1',
              reasonId: '1',
            },
          }),
        },
        {
          key: 'tickets/reason/2/p1',
          label: '確認待ち',
          activeClassName: 'bg-[#F8E7D3]',
          href: formatString(ROUTES.TICKETS_REASON, {
            params: {
              messageBoxId: '1',
              reasonId: '2',
            },
          }),
        },
        {
          key: 'tickets/closed/p1',
          label: '対応完了',
          activeClassName: 'bg-[#D3E9D7]',
          icon: <Check className="mr-2 h-4 w-4 text-green-600" />,
          href: formatString(ROUTES.TICKETS_CLOSED, {
            params: { messageBoxId: '1' },
          }),
        },
        {
          key: 'tickets/unwanted/p1',
          label: '対応不要',
          activeClassName: 'bg-[#E1DCDA]',
          icon: <X className="mr-2 h-4 w-4 text-gray-600" />,
          href: formatString(ROUTES.TICKETS_UNWANTED, {
            params: { messageBoxId: '1' },
          }),
        },
      ],
    },
    {
      group: 'カテゴリ',
      items: [
        {
          key: 'tickets/all/p1',
          label: 'すべてのチケット',
          indent: true,
          href: formatString(ROUTES.TICKETS_ALL, { params: { messageBoxId: '1' } }),
        },
        {
          key: 'tickets/sent/p1',
          label: '送信済み',
          indent: true,
          href: formatString(ROUTES.TICKETS_SENT, {
            params: { messageBoxId: '1' },
          }),
        },
        {
          key: 'tickets/scheduled/p1',
          label: '予約済み',
          indent: true,
          href: formatString(ROUTES.TICKETS_SCHEDULED, {
            params: { messageBoxId: '1' },
          }),
        },
        {
          key: 'tickets/draft/p1',
          label: '下書き',
          indent: true,
          href: formatString(ROUTES.TICKETS_DRAFT, {
            params: { messageBoxId: '1' },
          }),
        },
        {
          key: 'tickets/spam/p1',
          label: '迷惑メール',
          indent: true,
          href: formatString(ROUTES.TICKETS_SPAM, {
            params: { messageBoxId: '1' },
          }),
        },
        {
          key: 'tickets/trash/p1',
          label: 'ゴミ箱',
          indent: true,
          href: formatString(ROUTES.TICKETS_TRASH, {
            params: { messageBoxId: '1' },
          }),
        },
        {
          key: 'tickets/missed_call/p1',
          label: '不在着信',
          indent: true,
          href: formatString(ROUTES.TICKETS_MISSED_CALL, {
            params: { messageBoxId: '1' },
          }),
        },
        {
          key: 'tickets/voicemail/p1',
          label: '留守番電話',
          indent: true,
          href: formatString(ROUTES.TICKETS_VOICEMAIL, {
            params: { messageBoxId: '1' },
          }),
        },
      ],
    },
    {
      group: 'カスタムクエリ',
      items: [
        {
          key: 'tickets/query/1/p1',
          label: '自分が担当の未対応',
          indent: true,
          href: formatString(ROUTES.TICKETS_QUERY, {
            params: {
              messageBoxId: '1',
              queryId: '1',
            },
          }),
        },
      ],
    },
    {
      group: 'ラベル',
      items: [
        {
          key: 'tickets/label/1/p1',
          label: '重要',
          indent: true,
          href: formatString(ROUTES.TICKETS_LABEL, {
            params: {
              messageBoxId: '1',
              labelId: '1',
            },
          }),
        },
        {
          key: 'tickets/label/2/p1',
          label: '保留',
          indent: true,
          href: formatString(ROUTES.TICKETS_LABEL, {
            params: {
              messageBoxId: '1',
              labelId: '2',
            },
          }),
        },
      ],
    },
    {
      group: '一斉配信＋',
      items: [
        {
          key: 'broadcasts/all/p1',
          label: 'すべてのブロードキャスト',
          indent: true,
          href: formatString(ROUTES.TICKETS_BROADCAST_ALL, {
            params: {
              messageBoxId: '1',
            },
          }),
        },
        {
          key: 'broadcasts/draft/p1',
          label: '下書き',
          indent: true,
          href: formatString(ROUTES.TICKETS_BROADCAST_DRAFT, {
            params: {
              messageBoxId: '1',
            },
          }),
        },
        {
          key: 'broadcasts/scheduled/p1',
          label: '予約済み',
          indent: true,
          href: formatString(ROUTES.TICKETS_BROADCAST_SCHEDULED, {
            params: {
              messageBoxId: '1',
            },
          }),
        },
        {
          key: 'broadcasts/sending/p1',
          label: '配信中',
          indent: true,
          href: formatString(ROUTES.TICKETS_BROADCAST_SENDING, {
            params: {
              messageBoxId: '1',
            },
          }),
        },
        {
          key: 'broadcasts/sent/p1',
          label: '配信済み',
          indent: true,
          href: formatString(ROUTES.TICKETS_BROADCAST_SENT, {
            params: {
              messageBoxId: '1',
            },
          }),
        },
      ],
    },
  ];

  return (
    <div id="sidebar-content" className="h-full w-full">
      <div
        id="sidebar-header"
        className="grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-1"
        style={{ gridTemplateAreas: '"prepend content append"' }}
      >
        <div className="self-center overflow-hidden" style={{ gridArea: 'content' }}>
          <div className="sidebar-header-content">
            <div className="bg-color-base m-2 inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-white">
              <WalletCards className="inline-flex items-center" />
            </div>
            <BaseToolTip contentProps={{ children: '全員共有の受信箱' }}>
              <h3 className="truncate">
                <strong>全員共有の受信箱</strong>
              </h3>
            </BaseToolTip>
          </div>
        </div>
        <div className="flex flex-row items-center" style={{ gridArea: 'append' }}>
          <Button variant="ghost" className="h-10 w-10 justify-center rounded">
            <ListTodo className="h-6! w-6!" />
          </Button>
          <BaseToolTip contentProps={{ children: '設定' }}>
            <Button variant="ghost" className="h-10 w-10 justify-center rounded">
              <Settings className="h-6! w-6!" />
            </Button>
          </BaseToolTip>
        </div>
      </div>
      <div id="sidebar-body" className="flex h-full flex-col">
        <div className="flex-row-0 flex flex-row justify-around py-5">
          <Button
            className="color-grey-darken-4 button-hover h-10 w-[192px] items-center rounded-3xl bg-white px-[18px]"
            onClick={() =>
              openCenteredPopup(
                formatString(ROUTES.CREATE_MAIL_POP_OUT, {
                  query: { messageBoxId: '1' },
                }),
                '新規作成',
                890,
                676
              )
            }
          >
            <Send className="color-grey-darken-2 mr-2 h-6! w-6!" />
            新規作成
          </Button>
          <Button className="color-grey-darken-2 button-hover h-10 w-10 justify-center rounded-full bg-white">
            <ChevronDown />
          </Button>
        </div>
        <div id="sidebar-scroll" className="h-full space-y-1 overflow-y-auto px-2">
          {sidebarItems.map((section, index) => (
            <div key={index}>
              {section.group !== 'main' && (
                <Button
                  variant="ghost"
                  className="min-h-8 w-full justify-start py-2 pl-2 text-xs font-bold"
                  // onClick={() => {
                  //   const [isOpen, setIsOpen] = toggleMap[section.toggleState!];
                  //   setIsOpen(!isOpen);
                  // }}
                >
                  {section.group}
                  {/* {toggleMap[section.toggleState!][0] ? (
                      <ChevronUp className="ml-2" />
                    ) : (
                      <ChevronDown className="ml-2" />
                    )} */}
                </Button>
              )}

              {section.items.map(item => {
                return <ActiveLink key={item.key} href={item.href} item={item} />;
              })}

              <hr className="text-gray-300" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

TicketSidebar.displayName = 'TicketSidebar';
