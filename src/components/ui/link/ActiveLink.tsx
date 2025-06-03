'use client';

import React from 'react';
import clsx from 'clsx';
import Link from 'next/link';

import { usePathname } from 'next/navigation';
import { VariantProps } from 'class-variance-authority';
// types
import { SidebarItemType } from '@/types/sidebar';

type Props = Omit<VariantProps<typeof Link>, 'href'> & {
  href: string;
  item: SidebarItemType;
};

export const ActiveLink: React.FC<Props> = props => {
  const { href, item } = props;
  const pathname = usePathname();
  const isActive = pathname.includes(href) || pathname === href;
  return (
    <Link
      key={item.key}
      href={item.href}
      className={clsx(
        'mb-1 flex min-h-4 w-full rounded py-2 pl-3 text-xs hover:bg-[#ECECEC]',
        {
          'bg-[#D3D3D3]': isActive,
          [item.activeClassName ?? '']: isActive,
        },
        item.className
      )}
      prefetch={true}
    >
      {item.icon}
      {item.label}
    </Link>
  );
};
