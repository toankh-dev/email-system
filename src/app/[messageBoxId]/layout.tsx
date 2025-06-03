import React from 'react';
import { Metadata } from 'next';

// Components
import MainLayout from '@/components/layout/MainLayout';
import { TicketSidebar } from '@/components/ui/sidebar/TicketSidebar';
import { Header } from '@/components/ui/header/Header';

export const metadata: Metadata = {
  title: '全員共有の受信箱 | Re:lation',
  description: '全員共有の受信箱 | Re:lation',
};

interface MailLayoutProps {
  children: React.ReactNode;
}

const TicketLayout: React.FC<MailLayoutProps> = ({ children }) => {
  return (
    <MainLayout screenId="ticket" HeaderComponent={Header} SidebarComponent={TicketSidebar}>
      {children}
    </MainLayout>
  );
};

export default TicketLayout;
