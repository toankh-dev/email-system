import React, { Suspense } from 'react';
import LoadingBar from '../ui/loading/loading';

interface MainLayoutProps {
  screenId: string;
  SidebarComponent: React.ComponentType;
  children: React.ReactNode;
}

const SettingLayout: React.FC<MainLayoutProps> = props => {
  const { children, screenId, SidebarComponent } = props;

  return (
    <div className="flex h-full flex-col">
      <div id={`${screenId}-sub-sidebar`}>
        <nav className="navigation-drawer">
          <SidebarComponent />
        </nav>
      </div>
      <div id="main-sub-content">
        <Suspense fallback={<LoadingBar />}>{children}</Suspense>
      </div>
    </div>
  );
};

export default SettingLayout;
