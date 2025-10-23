'use client';

import React from 'react';
//components
import { ActiveLink } from '../link';
//constants
import { ROUTES } from '@/constants';
//utils
import { formatString } from '@/lib/client';
//types
import { SidebarListType } from '@/types/sidebar';

export const TicketSettingMailSidebar: React.FC = React.memo(() => {
  const sidebarItems: Array<SidebarListType> = [
    {
      group: 'メール',
      items: [
        {
          key: 'settings/mail/receive',
          label: '受信メール',
          indent: true,
          href: formatString(ROUTES.TICKET_SETTINGS_MAIL_RECEIVE, {
            params: {
              messageBoxId: '1',
              categoryId: '1',
              templateId: '1',
            },
          }),
        },
        {
          key: 'settings/mail/send',
          label: '送信メール',
          indent: true,
          href: formatString(ROUTES.TICKET_SETTINGS_MAIL_SEND, {
            params: {
              messageBoxId: '1',
              categoryId: '1',
              phraseId: '1',
            },
          }),
        },
        {
          key: 'settings/mail/compose',
          label: 'メール作成画面',
          indent: true,
          href: formatString(ROUTES.TICKET_SETTINGS_MAIL_COMPOSE, {
            params: {
              messageBoxId: '1',
            },
          }),
        },
        {
          key: 'settings/mail/attachment-url',
          label: '添付ファイルURL化',
          indent: true,
          href: formatString(ROUTES.TICKET_SETTINGS_MAIL_ATTACHMENT_URL, {
            params: {
              messageBoxId: '1',
            },
          }),
        },
        {
          key: 'settings/mail/auto-reply',
          label: '自動メール返信',
          indent: true,
          href: formatString(ROUTES.TICKET_SETTINGS_MAIL_AUTO_REPLY, {
            params: {
              messageBoxId: '1',
            },
          }),
        },
        {
          key: 'settings/mail/questionnaire',
          label: 'アンケートメール',
          indent: true,
          href: formatString(ROUTES.TICKET_SETTINGS_MAIL_QUESTIONNAIRE, {
            params: {
              messageBoxId: '1',
            },
          }),
        },
        {
          key: 'settings/mail/signature',
          label: '共用署名',
          indent: true,
          href: formatString(ROUTES.TICKET_SETTINGS_MAIL_SIGNATURE, {
            params: {
              messageBoxId: '1',
            },
          }),
        },
        {
          key: 'settings/mail/user-signature',
          label: '個人署名',
          indent: true,
          href: formatString(ROUTES.TICKET_SETTINGS_MAIL_USER_SIGNATURE, {
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
      <div id="sidebar-body" className="flex h-full flex-col">
        <div id="sidebar-scroll" className="pace-y-1 h-full overflow-y-auto px-2 pt-6">
          {sidebarItems.map((section, index) => (
            <div key={index}>
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

TicketSettingMailSidebar.displayName = 'TicketSettingMailSidebar';
