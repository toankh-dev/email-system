'use client';

import React from 'react';
import Image from 'next/image';

type NoResearchResultProps = {
  title?: string;
};

const NoResearchResult = ({ title = 'コンタクトエクスポート' }: NoResearchResultProps) => {
  return (
    <div className="w-full">
      <div className="min-w-[1200px] px-6 py-8">
        <h1 className="mb-8 text-[20px] leading-[28px] font-bold text-[rgba(0,0,0,0.87)]">{title}</h1>
        <button className="mt-4 mb-5 rounded-md bg-[#33AE40] px-6 py-2 text-sm leading-normal font-normal whitespace-nowrap text-[rgb(255,_255,_255)] hover:bg-[#2E9D39]">
          CSVファイルでエクスポートする
        </button>

        <h2 className="my-4 text-base leading-[36px] font-bold text-[rgba(0,0,0,0.87)]">エクスポート履歴</h2>
        <div className="flex flex-col items-center justify-center pt-3">
          <div className="flex justify-center text-[rgba(0,0,0,0.87)]">
            <Image
              src="https://cdn.relationapp.jp/assets_vite/images/no-search-result-w54ZjR5O.svg"
              alt="No search result"
              width={200}
              height={200}
            />
          </div>
          <p className="my-2 text-base font-bold text-[rgb(33,33,33)]">エクスポート履歴はありません</p>
        </div>
      </div>
    </div>
  );
};

export default NoResearchResult;
