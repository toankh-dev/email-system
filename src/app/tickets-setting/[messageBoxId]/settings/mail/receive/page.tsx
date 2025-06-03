'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { EyeOff, Plus, Server, EllipsisVertical } from 'lucide-react';
// components
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CardAlert } from '@/components/ui/alert';
import EmailDialog from '@/components/ui/dialog/EmailDialog';
import Typography from '@/components/Typography';
import { axiosInstance } from '@/lib/client';

interface POP3Account {
  id: number;
  host: string;
  port: number;
  username: string;
  message_box_id?: number;
  active?: boolean;
}

const TicketMailReceivePage = () => {
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [pop3Accounts, setPop3Accounts] = useState<POP3Account[]>([]);

  useEffect(() => {
    handleGetPop3Accounts();
  }, []);

  const handleGetPop3Accounts = async () => {
    try {
      const response = await axiosInstance.get('/api/pop3/accounts');
      const accounts = response.data.accounts;
      setPop3Accounts(accounts);
    } catch (error) {
      console.error('Error ofPOP3 accounts:', error);
    }
  };

  return (
    <>
      <div className="w-full flex-grow-1">
        <div className="px-6 pb-5">
          <div className="d-flex my-8">
            <h2 className="my-0 text-xl leading-10 font-bold">受信メール</h2>
          </div>
          <CardAlert
            href="https://faq.relationapp.jp/fa/support/web/knowledge2017.html"
            message="受信メールでは、受信するメールアドレスの設定をすることができます。"
            linkMessage="メールの受信設定をするには"
          />
          <CardAlert
            href="https://faq.relationapp.jp/fa/support/web/knowledge2017.html"
            message="受信メールでは、受信するメールアドレスの設定をすることができます。"
            linkMessage="メールの受信設定をするには"
          />
          <div>
            <div className="d-flex align-center my-6">
              <div className="d-flex align-center text-h3 my-0 leading-9">
                <span className="text-grey-darken-4 text-md mr-1 font-bold break-all">転送用メールアドレス</span>
                <span className="text-grey-darken-4 text-md mr-1 font-bold break-all">転送用メールアドレス</span>
              </div>
            </div>
            <Card className="text-body-1 my-6 rounded border p-6 leading-6">
              <div className="d-flex align-center">
                <span className="text-grey-darken-3 mr-2 text-sm font-normal">転送用メールアドレス</span>
                <span className="text-grey-darken-3 mr-2 text-sm font-normal">転送用メールアドレス</span>
                <span className="align-sub">
                  {' '}
                  ************************{' '}
                  <span>
                    <Button variant="ghost" className="h-5 w-5">
                      <EyeOff size={20} className="color-base !h-5 !w-5" />
                    </Button>
                  </span>
                </span>
              </div>
            </Card>
            <Card className="bg-grey-lighten-5 my-6 rounded border p-6">
              <span className="text-sm font-normal whitespace-pre-wrap">
                上記のメールアドレスに転送されたメールは、この受信箱にて受信されます。
                {'\n'}
                お使いのメールサービスにて転送設定を行ってください。{'\n\n'}
                受信メールの1通あたりの上限サイズは50メガバイトになります。上限を超えるサイズのメールは受信できませんのでご注意ください。
                {'\n'}
              </span>
            </Card>
          </div>
          <div className="align-center my-6 flex">
            <div className="flex items-center leading-9">
              <span className="text-grey-darken-4 text-md mr-1 font-bold break-all">POP3サーバ設定 （{pop3Accounts.length}）</span>
            </div>
            <div className="flex-grow-1"></div>
            <div className="inline-flex flex-grow-0 items-center">
              <Button
                variant="destructive"
                className="bg-color-base h-8 w-8 justify-center rounded-full text-white"
                onClick={() => {
                  setIsOpenPopup(!isOpenPopup);
                }}
              >
                <Plus className="inline-flex h-5 w-5 items-center justify-center" />
              </Button>
            </div>
          </div>
          <div className="text-center">
            {pop3Accounts.length > 0 ? (
              pop3Accounts.map(acc => (
                <Card key={acc.id} className="text-body-1 my-4 rounded border p-5 leading-6">
                  <div className="flex flex-row items-center justify-between">
                    <div className="text-grey-darken-3 flex items-center gap-2 text-left text-sm font-normal">
                      <Server />
                      <div className="text-md flex gap-1 font-medium text-gray-900">
                        <span>
                          <b> &quot;{acc.username}&quot;</b> ({acc.host}:{acc.port})
                        </span>
                      </div>
                    </div>
                    <div>
                      <EllipsisVertical />
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <>
                <div className="mb-1">
                  <Image
                    width={200}
                    height={200}
                    src="https://cdn.relationapp.jp/assets_vite/images/no-search-result-w54ZjR5O.svg"
                    alt="チケットがありません"
                    className="mx-auto"
                    loading="lazy"
                  />
                </div>
                <Typography variant="h1" size="md" className="mb-2 font-bold text-gray-900">
                  POP3サーバ設定 が登録されていません。
                </Typography>
              </>
            )}
          </div>
        </div>
      </div>
      <EmailDialog isOpen={isOpenPopup} onClose={() => setIsOpenPopup(false)} onRefresh={handleGetPop3Accounts} />
    </>
  );
};

export default TicketMailReceivePage;
