import React from 'react';
import { Metadata } from 'next';

// Components
import LoginLayout from '@/components/layout/LoginLayout';

export const metadata: Metadata = {
  title: 'Re:lation',
  description: 'Re:lation',
};

// Disable static generation (fix Next.js 15 CSS build error)
export const dynamic = 'force-dynamic';

interface MailLayoutProps {
  children: React.ReactNode;
}

const LoginPageLayout: React.FC<MailLayoutProps> = ({ children }) => {
  return <LoginLayout>{children}</LoginLayout>;
};

export default LoginPageLayout;
