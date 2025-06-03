import React from 'react';
import { Metadata } from 'next';

// Components
import SettingLayout from '@/components/layout/SettingLayout';
import { TicketSettingMailSidebar } from '@/components/ui/sidebar';

export const metadata: Metadata = {
  title: '受信メール | Re:lation',
  description: '受信メール | Re:lation',
};

interface PortalLayoutProps {
  children: React.ReactNode;
}

const SystemPageLayout: React.FC<PortalLayoutProps> = ({ children }) => {
  return (
    <SettingLayout screenId="mail-receive" SidebarComponent={TicketSettingMailSidebar}>
      {children}
    </SettingLayout>
  );
};

export default SystemPageLayout;
