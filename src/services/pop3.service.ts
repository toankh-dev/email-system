import { axiosInstance } from '@/lib/client';
import type { IPop3RegisterRequest, IPop3RegisterResponse, IPop3FetchEmailRequest, IPop3FetchEmailResponse } from '@/types/api';

export const registerPop3Setting = (data: IPop3RegisterRequest) => {
  return axiosInstance.post<IPop3RegisterResponse>('/api/pop3/register', data);
};

export const getEmailByPop3 = (data: IPop3FetchEmailRequest) => {
  return axiosInstance.post<IPop3FetchEmailResponse>('/api/pop3/store', data, {
    headers: { showProgress: true },
  });
};
