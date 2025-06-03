import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
// services
import { getTickets } from '@/services/ticket.service';
// types
import { useTicketStore } from '@/stores';
import { ITicket, ITicketOptions } from '@/types/TicketType';
import { IPaginationList } from '@/types/pagination';

export const TICKET_QUERY_KEY = {
  all: ['tickets'] as const,
  detail: (id: string) => [...TICKET_QUERY_KEY.all, id] as const,
};

export function useQueryTickets(options: ITicketOptions) {
  const storeTickets = useTicketStore(state => state.storeTickets);

  const query = useQuery<IPaginationList<ITicket>>({
    queryKey: [...TICKET_QUERY_KEY.all, 'fetch', options.status, options.pageIndex, options.pageSize],
    queryFn: async () => {
      const response = await getTickets(options.status, options.pageIndex, options.pageSize);
      return response.data;
    },
  });

  // Lưu vào store khi data thay đổi
  React.useEffect(() => {
    if (query.data) {
      storeTickets(query.data);
    }
  }, [query.data, storeTickets]);

  return query;
}

export const useInvalidateTickets = (options: ITicketOptions) => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({
      queryKey: [...TICKET_QUERY_KEY.all, 'fetch', options.status, options.pageIndex, options.pageSize],
    });
  };
};
