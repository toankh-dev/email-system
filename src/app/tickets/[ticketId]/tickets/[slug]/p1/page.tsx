//components
import ListBar from '@/app/tickets/components/ListBar';
import MailList from '@/app/tickets/components/MailList';
import ListLayout from '@/components/layout/ListLayout';
//constants
import { TicketStatus } from '@/constants/ticket';

export default async function MailPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const status = TicketStatus[slug as keyof typeof TicketStatus] || TicketStatus.open;

  return (
    <ListLayout listBarComponent={<ListBar status={status} />}>
      <MailList status={status} />
    </ListLayout>
  );
}
