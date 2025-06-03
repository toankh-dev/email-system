'use client';

import { BaseForm, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/input/Textarea';
import { useTranslations } from 'next-intl';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import z from 'zod';

type CreateMailFormValues = {
  to: string;
  cc?: string;
  subject: string;
  body: string;
};

export const CreateMailForm = () => {
  const text = useTranslations('EmailDialog');
  const formRef = React.useRef<UseFormReturn<CreateMailFormValues> | null>(null);

  const defaultValues = {
    to: '',
    cc: '',
    subject: '',
    body: '',
  };

  const schema = {
    to: z.string().min(1, { message: 'To is required' }),
    cc: z.string().optional(),
    subject: z.string().min(1, { message: 'Subject is required' }),
    body: z.string().min(1, { message: 'Body is required' }),
  };

  const onSubmit = (_: CreateMailFormValues) => {
    // TODO: Implement email sending logic
    // This will be handled by the email service
  };

  return (
    <BaseForm ref={formRef} schema={schema} defaultValues={defaultValues} className="h-full w-full" onSubmit={onSubmit}>
      {() => (
        <div className="relative flex h-full w-full flex-col bg-white">
          {/* Header */}
          <div className="flex h-14 min-h-14 min-w-[150px] items-center border-b border-gray-200 px-4">
            <div className="bg-blue-gray-500 flex h-8 w-8 items-center justify-center rounded-full">
              <span className="text-white">
                <i className="rei-method-mail mdi" style={{ fontSize: 20, height: 20, width: 20 }} />
              </span>
            </div>
            <div className="ml-2 text-2xl font-semibold">
              <span>{text('popout_window_title') || '新規メール'}</span>
            </div>
            <div className="flex-1" />
            <button type="button" className="mr-2 flex h-8 items-center rounded border border-gray-200 px-2 text-sm">
              {text('template_select') || 'テンプレート選択'}
            </button>
            <button type="button" className="flex h-8 items-center rounded border border-gray-200 px-2 text-sm">
              <span className="flex items-center text-gray-600">
                <i className="rei-arrow-back mdi" style={{ fontSize: 12, height: 12, width: 12 }} />
                <span className="ml-2">{text('phrase_select') || 'フレーズ選択'}</span>
              </span>
            </button>
          </div>
          {/* From */}
          <div className="flex w-full items-center border-b border-gray-200 px-4 py-1">
            <div className="flex min-w-[60px] items-center justify-end">
              <span className="text-base font-medium text-gray-800">From</span>
            </div>
            <div className="ml-4 w-full">
              <Input value={'"ふるさと納税doサポートチーム" <do-support@workthy.jp>【Google】'} readOnly className="font-bold" />
            </div>
          </div>
          {/* To/CC/BCC */}
          <div className="flex w-full items-center gap-4 px-4 py-2">
            <div className="flex min-w-[32px] items-center justify-end">
              <span className="text-base">To</span>
            </div>
            <div className="relative w-full">
              <FormField
                control={formRef.current?.control}
                name="to"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="new-input flex-grow text-base"
                        type="text"
                        autoFocus
                        placeholder={text('to_placeholder') || '入力してください'}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-sm text-red-500" />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex h-8 gap-2">
              <button type="button" className="rounded bg-gray-100 px-2 text-xs text-black">
                CC
              </button>
              <button type="button" className="rounded bg-gray-100 px-2 text-xs text-black">
                BCC
              </button>
              <button type="button" className="rounded bg-gray-100 px-2 text-xs text-black" disabled>
                <i className="rei-gnavi-contacts mdi text-black" style={{ fontSize: 18 }} />
              </button>
            </div>
          </div>
          {/* Subject */}
          <div className="flex min-h-12 items-center border-b border-gray-200 px-4">
            <span className="min-w-[36px] text-right text-base">件名</span>
            <div className="ml-4 flex-1">
              <FormField
                control={formRef.current?.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder={text('subject_placeholder') || '入力してください'} type="text" {...field} />
                    </FormControl>
                    <FormMessage className="text-sm text-red-500" />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {/* Body */}
          <div className="flex-1 overflow-y-auto px-4 py-2" style={{ minHeight: 0 }}>
            <FormField
              control={formRef.current?.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      className="w-full"
                      rows={8}
                      placeholder={text('body_placeholder') || 'メッセージを入力してください'}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-sm text-red-500" />
                </FormItem>
              )}
            />
          </div>
          {/* Footer Buttons */}
          <div className="flex h-16 items-center gap-2 overflow-x-auto border-t border-gray-200 bg-white px-4">
            <button type="button" className="rounded-full p-2 hover:bg-gray-100">
              <i className="rei-more-vert mdi text-gray-500" style={{ fontSize: 20 }} />
            </button>
            <button type="button" className="rounded-full p-2 hover:bg-gray-100">
              <i className="rei-ticket-label mdi" style={{ fontSize: 20 }} />
            </button>
            <button type="button" className="rounded-full p-2 hover:bg-gray-100">
              <i className="rei-ticket-category mdi" style={{ fontSize: 20 }} />
            </button>
            <button type="button" className="rounded-full p-2 hover:bg-gray-100">
              <i className="rei-signature mdi" style={{ fontSize: 20 }} />
            </button>
            <button type="button" className="relative rounded-full p-2 hover:bg-gray-100">
              <span className="relative">
                <i className="rei-ai-assistant mdi" style={{ fontSize: 24 }} />
                <span className="absolute right-0 bottom-0 h-2 w-2 rounded-full bg-red-500" style={{ display: 'none' }} />
              </span>
            </button>
            <div className="flex-1" />
            <div className="attachment-button">
              <label className="flex cursor-pointer items-center">
                <span className="flex h-10 w-10 items-center justify-center">
                  <i className="rei-attach-add mdi" style={{ fontSize: 20 }} />
                </span>
                <input className="hidden" type="file" multiple />
              </label>
            </div>
            <button type="button" className="ml-2 h-10 rounded border border-green-700 px-4 text-green-700">
              {text('approval_request') || '承認依頼'}
            </button>
            <div className="flex">
              <button type="submit" className="bg-primary h-10 rounded-l px-4 text-white">
                {text('send') || '送信'}
              </button>
              <button type="button" className="bg-primary h-10 rounded-r border-l border-green-700 px-2 text-white">
                <i className="rei-chevron-small-down mdi" style={{ fontSize: 16 }} />
              </button>
            </div>
            <button type="button" className="ml-2 rounded-full p-2 hover:bg-gray-100">
              <i className="rei-calendar mdi" style={{ fontSize: 20 }} />
            </button>
          </div>
        </div>
      )}
    </BaseForm>
  );
};
