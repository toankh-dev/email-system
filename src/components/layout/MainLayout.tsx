import React from 'react';
// Components
import NavigationDrawer from '../NavigationDrawer';

interface MainLayoutProps {
  screenId?: string;
  HeaderComponent: React.ComponentType;
  SidebarComponent: React.ComponentType;
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = props => {
  const { children, screenId = '', HeaderComponent, SidebarComponent } = props;

  return (
    <div id="app">
      <div id="app-wrapper">
        <NavigationDrawer />
        <HeaderComponent />
        <main id="main-content">
          <div id={`${screenId}-sidebar`}>
            <nav className="navigation-drawer">
              <SidebarComponent />
            </nav>
          </div>
          <div className="flex h-full flex-col">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
