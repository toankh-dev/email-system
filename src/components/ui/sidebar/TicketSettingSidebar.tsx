'use client';

import React from 'react';
import { ListTodo, Settings, WalletCards } from 'lucide-react';
//components
import { Button } from '@/components/ui/button';
import { BaseToolTip } from '../tooltip';
import { ROUTES } from '@/constants';
import { formatString } from '@/lib/client';
import { ActiveLink } from '../link';
import { SidebarListType } from '@/types/sidebar';

export const TicketSettingSidebar: React.FC = React.memo(() => {
  const sidebarItems: Array<SidebarListType> = [
    {
      group: '基本設定',
      items: [
        {
          key: 'settings/template',
          label: 'テンプレート',
          indent: true,
          href: formatString(ROUTES.TICKET_SETTINGS_TEMPLATE, {
            params: {
              messageBoxId: '1',
              categoryId: '1',
              templateId: '1',
            },
          }),
        },
        {
          key: 'settings/phrase',
          label: 'フレーズ',
          indent: true,
          href: formatString(ROUTES.TICKET_SETTINGS_PHRASE, {
            params: {
              messageBoxId: '1',
              categoryId: '1',
              phraseId: '1',
            },
          }),
        },
        {
          key: 'settings/rule/all',
          label: '自動ルール',
          indent: true,
          href: formatString(ROUTES.TICKET_SETTINGS_RULE, {
            params: {
              messageBoxId: '1',
            },
          }),
        },
        {
          key: 'settings/role',
          label: '受信箱権限',
          indent: true,
          href: formatString(ROUTES.TICKET_SETTINGS_ROLE, {
            params: {
              messageBoxId: '1',
            },
          }),
        },
        {
          key: 'settings/message-config/business-hours',
          label: 'メッセージ環境',
          indent: true,
          href: formatString(ROUTES.TICKET_SETTINGS_MESSAGE_CONFIG_BUSINESS_HOURS, {
            params: {
              messageBoxId: '1',
            },
          }),
        },
      ],
    },
    {
      group: 'サービス連携設定',
      items: [
        {
          key: 'settings/mail/receive',
          label: 'メール',
          indent: true,
          href: formatString(ROUTES.TICKET_SETTINGS_MAIL_RECEIVE, {
            params: {
              messageBoxId: '1',
            },
          }),
        },
        {
          key: 'settings/chat-widget',
          label: 'Re:Chat',
          indent: true,
          href: formatString(ROUTES.TICKET_SETTINGS_CHAT_WIDGET, {
            params: {
              messageBoxId: '1',
              chatWidgetId: '1',
            },
          }),
        },
        {
          key: 'settings/line',
          label: 'LINE',
          indent: true,
          href: formatString(ROUTES.TICKET_SETTINGS_LINE, {
            params: {
              messageBoxId: '1',
            },
          }),
        },
        {
          key: 'settings/chatwork',
          label: 'Chatwork',
          indent: true,
          href: formatString(ROUTES.TICKET_SETTINGS_CHAT_WORK, {
            params: {
              messageBoxId: '1',
            },
          }),
        },
        {
          key: 'settings/instagram',
          label: 'Instagram',
          indent: true,
          href: formatString(ROUTES.TICKET_SETTINGS_INSTAGRAM, {
            params: {
              messageBoxId: '1',
            },
          }),
        },
        {
          key: 'settings/facebook',
          label: 'Facebookページ',
          indent: true,
          href: formatString(ROUTES.TICKET_SETTINGS_FACEBOOK, {
            params: {
              messageBoxId: '1',
            },
          }),
        },
        {
          key: 'settings/chatplus',
          label: 'ChatPlus',
          indent: true,
          href: formatString(ROUTES.TICKET_SETTINGS_CHAT_PLUS, {
            params: {
              messageBoxId: '1',
            },
          }),
        },
        {
          key: 'settings/rms',
          label: 'R-Messe',
          indent: true,
          href: formatString(ROUTES.TICKET_SETTINGS_RMS, {
            params: {
              messageBoxId: '1',
            },
          }),
        },
        {
          key: 'settings/yahoo',
          label: 'Yahoo!',
          indent: true,
          href: formatString(ROUTES.TICKET_SETTINGS_YAHOO, {
            params: {
              messageBoxId: '1',
            },
          }),
        },
        {
          key: 'settings/sms/max-monthly-limit',
          label: 'SMS',
          indent: true,
          href: formatString(ROUTES.TICKET_SETTINGS_SMS_MAX_MONTHLY_LIMIT, {
            params: {
              messageBoxId: '1',
            },
          }),
        },
      ],
    },
    {
      group: '一斉配信+',
      items: [
        {
          key: 'settings/broadcast/max-monthly-limit',
          label: '一斉メール',
          indent: true,
          href: formatString(ROUTES.TICKET_SETTINGS_BROADCAST_MAX_MONTHLY_LIMIT, {
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
        <div className="flex flex-row items-center self-center" style={{ gridArea: 'append' }}>
          <Button variant="ghost" className="h-10 w-10 rounded">
            <ListTodo className="h-6! w-6!" />
          </Button>
          <BaseToolTip contentProps={{ children: '設定' }}>
            <Button variant="ghost" className="h-10 w-10 rounded">
              <Settings className="h-6! w-6!" />
            </Button>
          </BaseToolTip>
        </div>
      </div>
      <div id="sidebar-body" className="flex h-full flex-col">
        <div id="sidebar-scroll" className="pace-y-1 h-full overflow-y-auto px-2 pt-6">
          {sidebarItems.map((section, index) => (
            <div key={index}>
              <h5 className="min-h-8 w-full py-2 pl-2 text-xs font-[700]">{section.group}</h5>

              {section.items.map(item => {
                return <ActiveLink key={item.key} href={item.href} item={item} />;
              })}

              {index < sidebarItems.length - 1 && <hr className="text-gray-300" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

TicketSettingSidebar.displayName = 'TicketSettingSidebar';
