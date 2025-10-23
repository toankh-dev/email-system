import React from 'react';
import { Metadata } from 'next';

// Components
import MainLayout from '@/components/layout/MainLayout';
import { SystemSidebar } from '@/components/ui/sidebar';
import { SettingHeader } from '@/components/ui/header';

export const metadata: Metadata = {
  title: 'システム設定 | Re:lation',
  description: 'システム設定 | Re:lation',
};

interface PortalLayoutProps {
  children: React.ReactNode;
}

const SystemPageLayout: React.FC<PortalLayoutProps> = ({ children }) => {
  return (
    <MainLayout screenId="system" HeaderComponent={SettingHeader} SidebarComponent={SystemSidebar}>
      {children}
    </MainLayout>
  );
};

export default SystemPageLayout;
