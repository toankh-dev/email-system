import React from 'react';
import { Metadata } from 'next';

// Components
import MainLayout from '@/components/layout/MainLayout';
import { TicketSettingSidebar } from '@/components/ui/sidebar';
import { Header } from '@/components/ui/header';

export const metadata: Metadata = {
  title: 'システム設定 | Re:lation',
  description: 'システム設定 | Re:lation',
};

interface PortalLayoutProps {
  children: React.ReactNode;
}

const SystemPageLayout: React.FC<PortalLayoutProps> = ({ children }) => {
  return (
    <MainLayout screenId="ticket-setting" HeaderComponent={Header} SidebarComponent={TicketSettingSidebar}>
      {children}
    </MainLayout>
  );
};

export default SystemPageLayout;
