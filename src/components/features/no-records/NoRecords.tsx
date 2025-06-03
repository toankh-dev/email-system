'use client';
import React from 'react';
import { ExternalLink } from 'lucide-react';
import Image from 'next/image';
// components
import Typography from '@/components/Typography';

export const NoRecords = () => {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-39">
      <div className="mx-auto max-w-md">
        <div className="text-center">
          <div className="mb-1">
            <Image
              width={200}
              height={200}
              src="https://cdn.relationapp.jp/assets_vite/images/suggest-no-ticket-f5KbsxyW.svg"
              alt="チケットがありません"
              className="mx-auto h-auto max-w-48"
              loading="lazy"
            />
          </div>

          <Typography variant="h1" size="md" className="mb-2 font-bold text-gray-900">
            チケットがありません
          </Typography>

          <Typography variant="p" size="sm" className="mb-1 text-gray-600">
            「新規作成」ボタンから作成してみましょう。
          </Typography>

          <Typography variant="p" size="sm" className="flex items-center justify-center gap-1">
            <a
              href="https://faq.relationapp.jp/fa/support/web/knowledge15176.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:underline"
              style={{ color: '#0277BD' }}
            >
              「チケットがありません」と表示されたら
              <ExternalLink className="h-3 w-3" />
            </a>
          </Typography>
        </div>
      </div>
    </div>
  );
};
