//components
import ListBar from '@/app/[messageBoxId]/components/ListBar';
import MailList from '@/app/[messageBoxId]/components/MailList';
import { NoRecords } from '@/components/features/no-records/NoRecords';
import ListLayout from '@/components/layout/ListLayout';
//constants
import { TicketStatus } from '@/constants/ticket';

export default async function MailPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const status = TicketStatus[slug as keyof typeof TicketStatus];

  return (
    <ListLayout listBarComponent={<ListBar status={status} />}>
      {status === TicketStatus.open ? <MailList status={status} /> : <NoRecords />}
    </ListLayout>
  );
}
