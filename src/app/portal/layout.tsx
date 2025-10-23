import React from 'react';
import { Metadata } from 'next';

// Components
import MainLayout from '@/components/layout/MainLayout';
import { TicketSidebar } from '@/components/ui/sidebar';
import { Header } from '@/components/ui/header';

export const metadata: Metadata = {
  title: 'ポータル | Re:lation',
  description: 'ポータル | Re:lation',
};

interface PortalLayoutProps {
  children: React.ReactNode;
}

const PortalPageLayout: React.FC<PortalLayoutProps> = ({ children }) => {
  return (
    <MainLayout screenId="mail" HeaderComponent={Header} SidebarComponent={TicketSidebar}>
      {children}
    </MainLayout>
  );
};

export default PortalPageLayout;
