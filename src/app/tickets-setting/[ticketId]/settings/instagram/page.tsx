'use client';
import Image from 'next/image';
// components
import Typography from '@/components/Typography';
import { CardAlert } from '@/components/ui/alert';

const TicketInstagramPage = () => {
  return (
    <div className="px-6 pt-9">
      <Typography variant="h2" size="xl" className="text-grey-darken-4 my-0 font-bold">
        Instagram
      </Typography>

      <CardAlert
        href="https://faq.relationapp.jp/fa/support/web/knowledge15226.html"
        message="連携設定をすることで、InstagramのDM（ダイレクトメッセージ）のやり取りがRe:lationで行えます。"
        linkMessage="Instagramアカウントと連携するには"
      />
      <div className="mt-8 text-center">
        <div>
          <Image
            src="https://cdn.relationapp.jp/assets_vite/images/suggest-global-4EtvLRcx.svg"
            alt="Illustration for Instagram account linking suggestion"
            className="mx-auto h-auto max-w-full"
            loading="lazy"
          />
        </div>
        <Typography variant="p" size="md" className="py-2 font-bold">
          フリープランではInstagram アカウントを利用することができません
        </Typography>
      </div>
    </div>
  );
};

export default TicketInstagramPage;
