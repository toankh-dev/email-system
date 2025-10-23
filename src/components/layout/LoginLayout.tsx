import React, { Suspense } from 'react';
import LoadingBar from '../ui/loading/loading';
interface ILoginLayoutProps {
  children: React.ReactNode;
}

const LoginLayout: React.FC<ILoginLayoutProps> = props => {
  const { children } = props;

  return (
    <div id="login">
      <div id="login__wrapper">
        <main id="login__main-content">
          <div className="flex h-full flex-col">
            <Suspense fallback={<LoadingBar />}>{children}</Suspense>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LoginLayout;
