'use client';

import clsx from 'clsx';
import { MessageCircleMore } from 'lucide-react';

//components
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox/Checkbox';
//types
import { IMessage } from '@/types/TicketType';
//utils
import Typography from '@/components/Typography';
import { formatDate } from '@/lib/utils';

interface Props {
  message: IMessage;
  totalMessages?: number;
  checked: boolean;
  onCheck: (checked: boolean) => void;
}

export const MailItem = (props: Props) => {
  const { message, checked, totalMessages, onCheck } = props;
  return (
    <div
      className={clsx('flex min-h-[56px] w-full items-center', {
        'bg-[#FFF8E1]': checked,
        'bg-white hover:bg-gray-100': !checked,
      })}
    >
      {/* Checkbox */}
      <div className="flex items-center pl-4">
        <Checkbox
          className="cursor-pointer text-gray-300 ring-[1px] data-[state=checked]:border-green-600 data-[state=checked]:bg-green-600"
          checked={checked}
          onCheckedChange={onCheck}
        />
      </div>

      {/* Avatar */}
      <div className="flex items-center pl-3">
        <Avatar className="h-11 w-11">
          <AvatarImage width={34} height={34} src="https://github.com/shadcn.png" alt="@user" />
        </Avatar>
      </div>
      {/* <Link href={`/mail/${message.id}`} className="w-full ml-3 flex items-center"> */}
      <div className="ml-3 flex w-36 flex-col justify-center overflow-hidden">
        <div className="font-norma flex truncate">
          <Typography variant="span" size="xs" className="overflow-hidden">
            To: {message.senderDisplayName}
          </Typography>
          <Typography variant="span" size="xs" className="ml-2">
            {'(' + totalMessages + ')'}
          </Typography>
        </div>
        <div className="mt-1.5 flex text-xs text-gray-600">
          #{message.ticketId}
          <span className={clsx('ml-1 flex items-center text-xs')}>
            {message.status === '1' && '承認済'}
            {message.status === '2' && '下書き'}
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="relative ml-3 h-full w-full">
        <div className="absolute flex h-full w-full flex-col justify-center gap-1">
          <div className="flex overflow-hidden whitespace-nowrap">
            <Typography variant="span" size="xs" className="truncate">
              {message.subject} - {message.bodyPlain}
            </Typography>
          </div>
          <div className="flex w-full items-center truncate">
            <MessageCircleMore className="color-grey-lighten-1 flex h-4 w-4 truncate text-xs" />
            <Typography variant="span" size="xs" className="color-grey-lighten-1 ml-1">
              0
            </Typography>
          </div>
        </div>
      </div>
      {/* Time */}
      <div className="mx-3 flex w-40 flex-col justify-center">
        <div className="text-right text-xs">
          {formatDate(message.createdAt, {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
        <div className="flex justify-end">
          <div className="bg-open-status ml-3 rounded">
            <Typography variant="span" size="xs" className="h-5 px-1 py-1 text-white">
              未対応
            </Typography>
          </div>
        </div>
      </div>
      {/* </Link> */}
    </div>
  );
};
