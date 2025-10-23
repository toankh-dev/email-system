'use client';
import React from 'react';
import Image from 'next/image';
// components
import Typography from '@/components/Typography';
import { CardAlert } from '@/components/ui/alert';

const TicketChatWorkPage = () => {
  return (
    <div className="px-6 pt-9">
      <Typography variant="h2" size="xl" className="text-grey-darken-4 my-0 font-bold">
        Chatwork アカウント
      </Typography>

      <CardAlert
        href="https://faq.relationapp.jp/fa/support/web/knowledge15211.html"
        message="連携設定をすることで、Chatworkのやり取りがRe:lationで行えます。"
        linkMessage="Chatworkとチャネル連携するには"
      />
      <div className="mt-8 text-center">
        <div>
          <Image
            width={200}
            height={200}
            src="https://cdn.relationapp.jp/assets_vite/images/suggest-global-4EtvLRcx.svg"
            alt="Illustration for Chatwork account linking suggestion"
            className="mx-auto h-auto max-w-full"
            loading="lazy"
            onError={e => (e.currentTarget.src = '/fallback-image.svg')}
          />
        </div>
        <Typography variant="p" size="md" className="py-2 font-bold">
          フリープランではChatwork アカウントを利用することができません
        </Typography>
      </div>
    </div>
  );
};
export default TicketChatWorkPage;
