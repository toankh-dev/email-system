import { useMutation } from '@tanstack/react-query';
import type { AxiosResponse } from 'axios';
// services
import { getEmailByPop3 } from '@/services/pop3.service';
import type { IPop3FetchEmailResponse } from '@/types/api';

export const POP3_QUERY_KEY = {
  all: ['pop3'] as const,
  fetch: (id: string) => [...POP3_QUERY_KEY.all, 'fetch', id] as const,
};

export function useQueryPop3({ message_box_id }: { message_box_id: string }) {
  return useMutation<IPop3FetchEmailResponse, Error, void>({
    mutationKey: POP3_QUERY_KEY.fetch(message_box_id),
    mutationFn: async () => {
      const response: AxiosResponse<IPop3FetchEmailResponse> = await getEmailByPop3({ message_box_id });
      return response.data;
    },
  });
}
