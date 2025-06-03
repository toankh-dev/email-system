'use client';
import { Suspense, lazy } from 'react';

import MailItemSkeleton from './MailItemSkeleton';
// stores
import { useTicketStore } from '@/stores';
// constants
import { TicketStatus } from '@/constants/ticket';
// types
import LoadingBar from '@/components/ui/loading/loading';
import { useQueryTickets } from '@/hooks/api/useTicket';
import { ITicket } from '@/types/TicketType';

// Lazy load MailItem component
const MailItem = lazy(() =>
  import('./MailItem').then(module => ({
    default: module.MailItem, // Ensure the MailItem is exported correctly
  }))
);

interface Props {
  status: TicketStatus;
}

export default function MailList(props: Props) {
  const { status } = props;

  const data = useTicketStore(state => state.data);
  const checkedItems = useTicketStore(state => state.checkedItems);
  const pageIndex = useTicketStore(state => state.pageIndex);
  const pageSize = useTicketStore(state => state.pageSize);
  const { isFetching } = useQueryTickets({ status, pageIndex, pageSize });
  const setCheckedItem = useTicketStore(state => state.setCheckedItem);

  if (isFetching) {
    return <LoadingBar />;
  }

  return data.map((ticket: ITicket) => (
    <Suspense key={ticket.id} fallback={<MailItemSkeleton />}>
      <MailItem
        totalMessages={ticket.messages?.length}
        message={ticket.messages?.[0]}
        checked={!!checkedItems[ticket.id]}
        onCheck={(checked: boolean) => setCheckedItem(ticket.id, checked)}
      />
    </Suspense>
  ));
}
