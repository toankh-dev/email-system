'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from './Dialog';
import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { POP3_CONFIG } from '@/constants/pop3';
import { XIcon } from 'lucide-react';
import { DialogClose } from '@radix-ui/react-dialog';
import Typography from '@/components/Typography';
import { BaseForm } from '../form/BaseForm';
import { BaseForm } from '../form/BaseForm';
import z from 'zod';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../form/Form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../form/Form';
import { Input } from '../input/Input';
import { SelectItem, SelectTrigger, SelectValue, SelectContent, Select } from '../select';
import { UseFormReturn } from 'react-hook-form';
import { registerPop3Setting } from '@/services/pop3.service';
import type { IApiErrorDetail } from '@/types/api';

interface FormData {
  message_box_id: number;
  message_box_id: number;
  name: string;
  host: string;
  port: number;
  username: string;
  password: string;
  retain_days: number;
}

export default function EmailDialog(props: { isOpen: boolean; onClose: () => void; onRefresh?: () => void }) {
  const { isOpen, onClose, onRefresh } = props;
  const formRef = useRef<UseFormReturn<FormData>>(null);

  const defaultValues = {
    name: '',
    host: '',
    port: POP3_CONFIG.PORT,
    username: '',
    password: '',
    retain_days: 7,
  };

  const onSubmit = async (data: FormData) => {
    const { reset } = formRef.current || {};
    try {
      // Map FormData to IPop3RegisterRequest
      const requestData = {
        message_box_id: '1', // TODO: Replace with actual message box ID
        email: data.username, // Using username as email
        password: data.password,
        pop3_server: data.host,
        pop3_port: POP3_CONFIG.PORT,
        use_ssl: true,
      };
      const response = await registerPop3Setting(requestData);
      const result = response.data;

      if (result.message) {
        toast.success(result.message);
        reset?.();
      }

      if (result.detail) {
        if (typeof result.detail === 'string') {
          toast.error(result.detail);
          return;
        }
        if (Array.isArray(result.detail) && result.detail.length > 0) {
          result.detail.forEach((item: IApiErrorDetail) => {
            toast.error(item.msg);
          });
          return;
        }
      }
      onClose();
      onRefresh?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const text = useTranslations('EmailDialog');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent showCloseButton={false} className="w-full sm:max-w-[800px]">
      <DialogContent showCloseButton={false} className="w-full sm:max-w-[800px]">
        <DialogClose className="!absolute top-4 right-4">
          <XIcon />
          <Typography variant="span" className="sr-only">
            閉じる
          </Typography>
        </DialogClose>
        <DialogHeader>
          <DialogTitle>
            <Typography variant="h2" className="text-2xl font-bold">
              {text('title')}
            </Typography>
          </DialogTitle>
        </DialogHeader>
        <hr className="my-2" />

        <BaseForm
          schema={{
            name: z.string().min(1, { message: 'Name is required' }),
            host: z.string().min(1, { message: 'Host is required' }),
            username: z.string().min(1, { message: 'Username is required' }),
            password: z.string().min(1, { message: 'Password is required' }),
            retain_days: z.number().min(0, {
              message: 'Retain days is required',
            }),
          }}
          defaultValues={defaultValues}
          className="w-full space-y-4"
          onSubmit={onSubmit}
        >
          {({ control }) => (
            <>
              <div className="flex flex-col gap-6 md:flex-row">
                {/* LEFT FORM */}
                <div className="w-full space-y-4 md:w-3/4">
                  <div>
                    <FormField
                      control={control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{text('name_label')}</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder={text('name_placeholder')} {...field} />
                            <Input type="text" placeholder={text('name_placeholder')} {...field} />
                          </FormControl>
                          <FormMessage className="text-sm text-red-500" />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={control}
                      name="host"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{text('host_label')}</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder={text('host_placeholder')} {...field} />
                            <Input type="text" placeholder={text('host_placeholder')} {...field} />
                          </FormControl>
                          <FormMessage className="text-sm text-red-500" />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{text('username_label')}</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder={text('username_placeholder')} {...field} />
                            <Input type="text" placeholder={text('username_placeholder')} {...field} />
                          </FormControl>
                          <FormMessage className="text-sm text-red-500" />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{text('password_label')}</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder={text('password_placeholder')} {...field} />
                            <Input type="text" placeholder={text('password_placeholder')} {...field} />
                          </FormControl>
                          <FormMessage className="text-sm text-red-500" />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={control}
                      name="retain_days"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{text('retain_days_label')}</FormLabel>
                          <Select value={field.value?.toString() || ''} onValueChange={value => field.onChange(Number(value))}>
                          <Select value={field.value?.toString() || ''} onValueChange={value => field.onChange(Number(value))}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select retain days" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="z-[1007] bg-white">
                              <SelectItem value="0">0</SelectItem>
                              <SelectItem value="7">7</SelectItem>
                              <SelectItem value="14">14</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* RIGHT SIDE: Info */}
                <div className="w-full overflow-hidden rounded border bg-gray-50 p-4 text-sm leading-relaxed text-gray-800 md:h-1/3 md:w-1/2">
                  <Typography variant="p">{text.raw('info_box.lead')}</Typography>
                  <Typography variant="p">{text.raw('info_box.lead')}</Typography>
                  <ul className="mt-2 list-inside list-disc">
                    {(text.raw('info_box.list') as string[]).map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                    {(text.raw('info_box.list') as string[]).map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>

                  <Typography variant="p" className="mt-2">
                    {text.raw('info_box.footer')}
                  </Typography>
                </div>
              </div>
            </>
          )}
        </BaseForm>
      </DialogContent>
    </Dialog>
  );
}
