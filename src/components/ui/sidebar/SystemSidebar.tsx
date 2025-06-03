'use client';

import React from 'react';
import { ListTodo, Settings, WalletCards } from 'lucide-react';
//components
import { ActiveLink } from '../link';
import { BaseToolTip } from '../tooltip';
import { Button } from '@/components/ui/button';
// constants
import { ROUTES } from '@/constants';
// types
import { SidebarListType } from '@/types/sidebar';

export const SystemSidebar: React.FC = React.memo(() => {
  const sidebarItems: Array<SidebarListType> = [
    {
      group: '基本設定',
      items: [
        {
          key: 'message-box-setting',
          label: '受信箱',
          indent: true,
          href: ROUTES.SYSTEM_MESSAGE_BOX_SETTINGS,
        },
        {
          key: 'customer-group',
          label: 'アドレス帳',
          indent: true,
          href: ROUTES.SYSTEM_CUSTOMER_GROUP,
        },
        {
          key: 'dashboard',
          label: 'ダッシュボード',
          indent: true,
          href: ROUTES.SYSTEM_DASHBOARD,
        },
        {
          key: 'user',
          label: 'ユーザ',
          indent: true,
          href: ROUTES.SYSTEM_USER,
        },
      ],
    },
    {
      group: 'セキュリティ設定',
      items: [
        {
          key: 'group',
          label: '権限グループ',
          indent: true,
          href: ROUTES.SYSTEM_GROUP,
        },
        {
          key: 'role-customization',
          label: '権限グループ',
          indent: true,
          href: ROUTES.SYSTEM_ROLE_CUSTOMIZATION,
        },
        {
          key: 'login-auth/login',
          label: 'ログイン認証',
          indent: true,
          href: ROUTES.SYSTEM_LOGIN_AUTH,
        },
        {
          key: 'audit-log',
          label: '監査ログ',
          indent: true,
          href: ROUTES.SYSTEM_AUDIT_LOG,
        },
        {
          key: 'ip-restriction',
          label: 'IPアドレス制限',
          indent: true,
          href: ROUTES.SYSTEM_IP_RESTRICTION,
        },
        {
          key: 'risky-url-warning',
          label: '詐欺リンクのクリック防止',
          indent: true,
          href: ROUTES.SYSTEM_RISKY_URL_WARNING,
        },
        {
          key: 'api-token',
          label: 'APIトークン',
          indent: true,
          href: ROUTES.SYSTEM_API_TOKEN,
        },
      ],
    },
    {
      group: 'クラウド電話',
      items: [
        {
          key: 'call',
          label: 'クラウド電話',
          indent: true,
          href: ROUTES.SYSTEM_CALL,
        },
      ],
    },
    {
      group: '契約',
      items: [
        {
          key: 'agreement-plan',
          label: 'ご契約中のプラン内容',
          indent: true,
          href: ROUTES.SYSTEM_AGREEMENT_PLAN,
        },
      ],
    },
    {
      group: 'サーバ情報',
      items: [
        {
          key: 'using-ip',
          label: '使用中サーバのIPアドレス',
          indent: true,
          href: ROUTES.SYSTEM_USING_IP,
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

SystemSidebar.displayName = 'SystemSidebar';
