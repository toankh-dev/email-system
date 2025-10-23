'use client';

import React from 'react';
import Image from 'next/image';

type SuggestGlobalProps = {
  title?: string;
};

const SuggestGlobal = ({ title = 'コンタクト同期連携' }: SuggestGlobalProps) => {
  return (
    <div className="p-8">
      <h1 className="mb-2 text-xl leading-[40px] font-bold text-[rgb(33,33,33)]">{title}</h1>
      <div className="flex flex-col items-center justify-center pt-14">
        <div className="ml-60 flex h-auto w-full max-w-[5000px] justify-center text-[rgba(0,0,0,0.87)]">
          <Image
            src="https://cdn.relationapp.jp/assets_vite/images/suggest-global-4EtvLRcx.svg"
            alt="Suggest Global"
            width={200}
            height={200}
          />
        </div>
        <p className="mt-2 ml-50 text-center text-sm leading-[22px] font-normal text-[rgb(33,33,33)]">
          コンタクト同期連携を利用するには別途オプション契約が必要です
        </p>
        <p className="ml-35 text-center text-sm leading-[22px] font-normal text-[rgb(33,33,33)]">
          オプション契約の詳細につきましては
          <a className="text-[rgb(2,119,189)]" href="#">
            support@ingage.jp
          </a>
          までご連絡ください。
        </p>
      </div>
    </div>
  );
};

export default SuggestGlobal;
