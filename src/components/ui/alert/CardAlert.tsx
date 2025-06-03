'use client';
import React from 'react';
import ReactDOM from 'react-dom/client';
import Link from 'next/link';
import { ExternalLink, HelpCircle, MoveRight, X } from 'lucide-react';
//components
import { Card } from '../card';
import { Button } from '../button';

interface CardAlertProps {
  href: string;
  message: string;
  linkMessage: string;
}
export const CardAlert: React.FC<CardAlertProps> = props => {
  const { href, message, linkMessage } = props;
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleClose = () => {
    if (containerRef.current) {
      const root = ReactDOM.createRoot(containerRef.current);
      root.unmount();
      containerRef.current.remove();
    }
  };

  return (
    <Card ref={containerRef} className="bg-color-lighten-5 border-color-darken-1 my-6 border-l-8 p-4">
      <div role="alert">
        <div>
          <div className="flex">
            <div className="color-grey-darken-2 w-10 flex-grow-0 pr-4 text-right">
              <HelpCircle className="h-6 w-6" />
            </div>
            <div className="flex-grow-1 text-left text-sm leading-6 font-normal">
              <p className="mb-0 whitespace-pre-wrap">{message}</p>
              <div className="t-3 flex items-center">
                <span className="color-grey-darken-2 mr-1">
                  <MoveRight className="h-5 w-5" />
                </span>
                <Link className="text-decoration-none color-link inline-flex" target="_blank" href={href}>
                  {linkMessage}
                  <span className="ml-1">
                    <ExternalLink className="h-5 w-5" />
                  </span>
                </Link>
              </div>
            </div>
            <div className="flex w-10 flex-grow-0 pl-4 text-left">
              <Button variant="ghost" className="color-grey-darken-2 h-6 w-6 rounded p-0" onClick={handleClose}>
                <X className="!h-5 !w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
