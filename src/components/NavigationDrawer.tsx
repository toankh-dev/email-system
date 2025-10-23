'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { House, AppWindow, Contact, Wrench, BookOpen } from 'lucide-react';
// components
// components
import { BaseToolTip } from './ui/tooltip';
import PopupInbox from './PopupInbox';
// constants
import { ROUTES } from '@/constants';

const NavigationDrawer: React.FC = () => {
  const [showTicketPopup, setShowTicketPopup] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const toggleTicketPopup = () => {
    if (showTicketPopup) {
      setIsAnimating(false);
      setTimeout(() => setShowTicketPopup(false), 300);
    } else {
      setShowTicketPopup(true);
      setTimeout(() => setIsAnimating(true), 10);
    }
  };

  useEffect(() => {
    if (!showTicketPopup) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        ticketRef.current &&
        !ticketRef.current.contains(e.target as Node) &&
        popupRef.current &&
        !popupRef.current.contains(e.target as Node)
      ) {
        setIsAnimating(false);
        setTimeout(() => setShowTicketPopup(false), 300);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showTicketPopup]);

  return (
    <>
      <nav className="navigation-drawer flex flex-col items-center bg-black pb-25 text-gray-300">
        <div className="">
          <Image
            width={52}
            height={52}
            src="data:image/svg+xml,%3csvg%20width='52'%20height='52'%20viewBox='0%200%2052%2052'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3crect%20width='52'%20height='52'%20fill='white'/%3e%3cpath%20d='M25.8877%2032.3999L14.8008%2025.9999V38.7999L25.8877%2032.3999Z'%20fill='%23212121'/%3e%3cpath%20d='M14.8008%2038.7999L25.8877%2032.3999V45.1999L14.8008%2038.7999Z'%20fill='white'/%3e%3cpath%20d='M14.8008%2025.9999L25.8877%2019.5999V32.3999L14.8008%2025.9999Z'%20fill='%23212121'/%3e%3cpath%20d='M14.8008%2013.1999L25.8877%206.79987V19.5999L14.8008%2013.1999Z'%20fill='%23212121'/%3e%3cpath%20d='M36.9715%2025.9999L25.8867%2019.5999V32.3999L36.9715%2025.9999Z'%20fill='white'/%3e%3cpath%20d='M36.9715%2038.7999L25.8867%2032.3999V45.1999L36.9715%2038.7999Z'%20fill='%232BAB38'/%3e%3cpath%20d='M25.8867%2019.5999L36.9715%2013.1999V25.9999L25.8867%2019.5999Z'%20fill='%23212121'/%3e%3cpath%20d='M25.8867%2032.3999L36.9715%2025.9999V38.7999L25.8867%2032.3999Z'%20fill='%232BAB38'/%3e%3c/svg%3e"
            alt=""
          />
        </div>
        <div className="flex h-full w-full flex-col justify-between pt-6">
          <div className="flex h-full w-full flex-col items-center">
            <div className="flex h-13 w-full cursor-pointer items-center justify-center hover:bg-[#494949]">
              <BaseToolTip contentProps={{ children: <>ポータル</> }}>
                <House />
              </BaseToolTip>
            </div>
            <div className="relative h-13 w-full" ref={ticketRef}>
              <div className="flex h-full w-full cursor-pointer items-center justify-center hover:bg-[#494949]" onClick={toggleTicketPopup}>
                <BaseToolTip contentProps={{ children: <>チケット管理</> }}>
                  <AppWindow />
                </BaseToolTip>
              </div>
            </div>
            <div className="flex h-13 w-full cursor-pointer items-center justify-center hover:bg-[#494949]">
              <BaseToolTip contentProps={{ children: <>コンタクト管理</> }}>
                <Contact />
              </BaseToolTip>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="h-13 w-full">
              <BaseToolTip contentProps={{ children: <>システム設定</> }}>
                <Link
                  href={ROUTES.SYSTEM_MESSAGE_BOX_SETTINGS}
                  className="flex h-full cursor-pointer items-center justify-center hover:bg-[#494949]"
                >
                  <Wrench className="h-5! w-5!" />
                </Link>
              </BaseToolTip>
            </div>
            <div className="flex h-13 w-full cursor-pointer items-center justify-center hover:bg-[#494949]">
              <BaseToolTip contentProps={{ children: <>ヘルプ</> }}>
                <BookOpen />
              </BaseToolTip>
            </div>
          </div>
        </div>
      </nav>
      {showTicketPopup && (
        <div
          ref={popupRef}
          className="fixed z-[2000]"
          style={{
            top: '121px',
            left: '52px',
          }}
        >
          <div
            className={`transform transition-all duration-300 ease-out ${
              isAnimating ? 'translate-x-0 translate-y-0 scale-100 opacity-100' : 'scale-0 opacity-0'
            }`}
            style={{ transformOrigin: '0 0' }}
          >
            <PopupInbox />
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(NavigationDrawer);
