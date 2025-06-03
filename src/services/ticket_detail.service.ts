import { axiosInstance } from '@/lib/client';
import type { ITicketDetailResponse, IAddCommentRequest, IAddCommentResponse } from '@/types/api';

export const getTicketDetail = (ticketId: number) => {
  return axiosInstance.get<ITicketDetailResponse>(`/api/ticket/${ticketId}`);
};

export const addComment = (data: IAddCommentRequest) => {
  return axiosInstance.post<IAddCommentResponse>(`/api/ticket/add-comment`, data);
};
