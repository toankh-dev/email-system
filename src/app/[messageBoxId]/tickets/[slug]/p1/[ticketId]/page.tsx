'use client';

import { MessageTimeLine } from '@/app/[messageBoxId]/components/MessageTimeLine';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import InputAddCommentTicket from '@/components/ui/input/InputAddConmentTicket';
import LoadingBar from '@/components/ui/loading/loading';
import { ROUTES } from '@/constants';
import { formatDate, formatString } from '@/lib/client/utils';
import { getTicketDetail } from '@/services/ticket_detail.service';
import clsx from 'clsx';
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  EllipsisVertical,
  Flag,
  Mail,
  Monitor,
  MoreVertical,
  MoveRight,
  Reply,
  Send,
  Tag,
  Trash2,
  X,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import type { ITicketDetailMessage } from '@/types/api';
import { sanitizeEmailHtml } from '@/lib/client/security';

// Use the well-typed interface from api.ts
type Message = ITicketDetailMessage;

const TicketsPage = () => {
  const [selectedMessage, setSelectedMessage] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isOpenHistory, setIsOpenHistory] = useState(false);
  const [isOpenTo, setIsOpenTo] = useState(false);
  const [loading, setLoading] = useState(false);
  const { ticketId } = useParams();
  const router = useRouter();

  // Sanitize all email HTML content for XSS protection
  const sanitizedMessages = useMemo(() => {
    return messages.map(message => ({
      ...message,
      bodyHtml: sanitizeEmailHtml(message.bodyHtml || ''),
    }));
  }, [messages]);

  const handleBack = () => {
    router.replace(formatString(ROUTES.TICKETS_OPEN, { params: { messageBoxId: '1' } }));
  };

  useEffect(() => {
    const fetchTicketDetail = async () => {
      try {
        setLoading(true);
        const res = await getTicketDetail(Number(ticketId));
        setMessages(res.data.messages);
      } catch (error) {
        console.error('Error fetching ticket detail:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTicketDetail();
  }, [ticketId]);

  const fetchTicketDetail = async () => {
    const res = await getTicketDetail(Number(ticketId));
    setMessages(res.data.messages);
  };

  useEffect(() => {
    if (messages.length == 1) {
      setSelectedMessage(0);
    }
  }, [messages]);

  if (loading || !messages || messages.length === 0) {
    return <LoadingBar />;
  }

  return (
    <>
      {/* Toolbar */}
      <div className="text-muted-foreground border-color flex min-h-12 items-center space-x-4 border-b-1 px-4 py-2 text-sm">
        <Button variant="ghost" className="color-grey-darken-2 h-7 w-7 justify-center p-0" onClick={handleBack}>
          <ArrowLeft className="h-5! w-5!" />
        </Button>
        <div className="rounded bg-blue-100 p-1.5 text-blue-500">
          <Monitor className="h-4 w-4" />
        </div>
        <div className="flex cursor-pointer items-center space-x-0.5">
          <Clock className="h-4 w-4" />
          <ChevronDown className="h-3 w-3" />
        </div>
        <Check className="h-4 w-4 cursor-pointer" />
        <X className="h-4 w-4 cursor-pointer" />
        <Trash2 className="h-4 w-4 cursor-pointer" />
        <AlertTriangle className="h-4 w-4 cursor-pointer" />
        <Flag className="h-4 w-4 cursor-pointer" />
        <div className="flex cursor-pointer items-center space-x-0.5">
          <Tag className="h-4 w-4" />
          <ChevronDown className="h-3 w-3" />
        </div>
        <div className="flex cursor-pointer items-center space-x-0.5">
          <MoveRight className="h-4 w-4" />
          <ChevronDown className="h-3 w-3" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <MoreVertical className="h-4 w-4 cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 border border-gray-200 bg-white text-sm shadow-lg">
            <DropdownMenuItem>📩 既読にする</DropdownMenuItem>
            <DropdownMenuItem>📂 別の受信箱に移動</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>🖨️ すべて印刷</DropdownMenuItem>
            <DropdownMenuItem>🖨️ すべて印刷（コメント付き）</DropdownMenuItem>
            <DropdownMenuItem>🖨️ すべて印刷（操作履歴付き）</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>🔗 チケットのリンクをコピー</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="ml-auto flex">
          <ChevronLeft className="h-4 w-4 cursor-pointer hover:text-blue-500" />
          <ChevronRight className="h-4 w-4 cursor-pointer hover:text-blue-500" />
        </div>
      </div>

      {/* Main layout */}
      <div className="relative! flex h-full w-full overflow-auto">
        {/* Left: Ticket list + detail */}
        <div className="w-3/4">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center space-x-2 text-xl font-semibold text-gray-900">
              <span>Re: test1111</span>
              <span className="text-base font-normal text-gray-500">#2488231</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">SPLUS</div>
              <span className="text-sm font-medium text-gray-900">SPLUS 担当者</span>
            </div>
          </div>

          {/* Message list */}
          <div className="mb-2 ml-3 flex items-center justify-start px-4">
            {isOpenHistory ? (
              <div className="flex items-center space-x-2" onClick={() => setIsOpenHistory(false)}>
                <div
                  id="ticket-history"
                  className="relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-300"
                >
                  <X className="h-4 w-4 text-gray-600" />
                </div>
                <span className="cursor-pointer text-sm text-gray-800 underline">操作履歴を閉じる</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2" onClick={() => setIsOpenHistory(true)}>
                <div className="relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-300">
                  <EllipsisVertical className="h-4 w-4 text-gray-600" />
                </div>
                <span className="cursor-pointer text-sm text-gray-800 underline">すべての操作履歴を表示する</span>
              </div>
            )}
          </div>
          <div
            id="ticket-message-action"
            className={clsx('flex flex-col px-4', {
              'gap-2': !isOpenHistory,
            })}
          >
            {messages.map((message, index) => (
              <div key={index} className="flex flex-col">
                {isOpenHistory && (
                  <div className="space-y-2 pl-0.5">
                    {message?.messageHistories?.map((history, index) => (
                      <div key={index} className="ml-3 flex items-center gap-2">
                        <MessageTimeLine />
                        <div className="text-[11px] leading-relaxed text-gray-700">
                          <div className="mt-1 flex items-center gap-1">
                            <span className="text-gray-500">
                              {formatDate(history.createdAt, {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                            <span>
                              <strong className="mx-1 text-gray-800">{history.reason}</strong>
                              {history.action}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div
                  onClick={() => setSelectedMessage(selectedMessage === index ? null : index)}
                  className="border-color flex cursor-pointer items-start justify-between rounded-t-sm border-1 bg-white p-3 hover:bg-gray-50"
                >
                  <div className="flex items-start gap-3">
                    <div className={`rounded-full ${index < 2 ? 'bg-gray-200' : 'bg-blue-100'} p-2`}>
                      <Send className={`h-6 w-6 ${index < 2 ? 'text-gray-600' : 'text-blue-500'}`} />
                    </div>

                    <div className="flex flex-col text-sm">
                      <div className="font-medium text-gray-700">
                        {message.senderDisplayName}（{index + 1}/{messages.length}）
                      </div>
                      <div className="text-gray-500">{message.subject}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>
                      {formatDate(message.receivedAt, {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <MoreVertical className="h-4 w-4 cursor-pointer" />
                  </div>
                </div>

                {selectedMessage === index && (
                  <div className="border-color relative rounded-b-sm border-x-1 border-b-1 bg-white p-4 text-sm text-gray-800">
                    <div className="flex items-center gap-1 pt-2 pb-2">
                      <span className="font-semibold text-gray-600">To:</span>
                      <span>{message.senderEmail}</span>
                      <ChevronDown className="h-3 w-3" onClick={() => setIsOpenTo(!isOpenTo)} />
                    </div>
                    {isOpenTo && (
                      <div className="absolute top-10 left-3 ml-[160px] w-fit rounded-md border bg-white px-4 py-2 text-xs text-gray-800 shadow">
                        {/* From */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex gap-1">
                            <span className="font-semibold text-gray-700">From:</span>
                            <span>
                              {message.sender} &lt;
                              <span className="text-blue-600">{message.senderEmail}</span>
                              &gt;
                            </span>
                          </div>
                          <div className="flex cursor-pointer gap-1 text-gray-500">
                            <Reply className="h-4 w-4" />
                          </div>
                        </div>

                        {/* To */}
                        <div className="mt-1 flex items-center justify-between gap-2">
                          <div className="flex gap-1">
                            <span className="font-semibold text-gray-700">To:</span>
                            <span className="text-blue-600">{message.senderEmail}</span>
                          </div>
                          <div className="flex cursor-pointer gap-1 text-gray-500">
                            <Reply className="h-4 w-4" />
                          </div>
                        </div>

                        {/* Reply-To */}
                        <div className="mt-1 flex items-center justify-between gap-2">
                          <div className="flex gap-1">
                            <span className="font-semibold text-gray-700">Reply-To:</span>
                            <span className="text-blue-600">{message.senderEmail}</span>
                          </div>
                          <div className="flex cursor-pointer gap-1 text-gray-500">
                            <Reply className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="text-gray-800">
                      <strong> コメント (0)</strong>
                    </div>
                    <InputAddCommentTicket messageId={message.id} listComment={message.comments} fetchTicketDetail={fetchTicketDetail} />
                    <div className="mt-2 ml-4 pl-4">
                      {/* HTML content is sanitized for XSS protection */}
                      <div
                        dangerouslySetInnerHTML={{
                          __html: sanitizedMessages.find(m => m.id === message.id)?.bodyHtml || '',
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="border-color flex h-full w-[320px] flex-grow-1 flex-col border-x-1 border-b-1 bg-white shadow-sm">
          <div className="border-color flex items-center justify-between border-b-1 px-4 py-2">
            <h2 className="text-sm font-semibold text-gray-800">関連するお客様情報</h2>
            <button className="text-gray-500 hover:text-gray-700">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 space-y-2 overflow-y-auto px-2 py-2">
            {[
              { email: 'toankh@splus-software.com', name: '***** *****' },
              { email: 'thinh@splus-software.com.vn', name: '***** *****' },
            ].map((user, i) => (
              <div key={i} className="border-color rounded border-1 bg-white px-3 py-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-800">{user.name}</span>
                  <div className="flex items-center gap-1">
                    <button className="text-gray-400 hover:text-black">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M5.121 17.804A4 4 0 019 15h6a4 4 0 013.879 2.804M16 11a4 4 0 10-8 0 4 4 0 008 0z" />
                      </svg>
                    </button>
                    <button className="text-gray-400 hover:text-black">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="mt-1 flex items-center gap-1 text-sm break-all text-blue-600">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{user.email}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="border-color flex items-center justify-between border-t-1 px-3 py-2">
            <button className="text-gray-500 hover:text-gray-700">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TicketsPage;
