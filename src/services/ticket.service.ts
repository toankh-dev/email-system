// constants
import { TicketStatus } from '@/constants/ticket';
// types
import { IPaginationList } from '@/types/pagination';
import { ITicket } from '@/types/TicketType';
// libs
import { axiosInstance } from '@/lib/client';

export const getTickets = (status: TicketStatus, pageIndex: number, pageSize: number) => {
  return axiosInstance.get<IPaginationList<ITicket>>(`/api/ticket?status_id=${status}&page_index=${pageIndex}&page_size=${pageSize}`);
};
