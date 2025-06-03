import { TicketStatus } from '@/constants/ticket';

export interface ITicket {
  id: number;
  status: string;
  resourceType: string;
  updatedBy: number;
  updatedAt: string;
  resourceId: string;
  messageBoxId: number;
  flag: number;
  createdby: number;
  createdAt: string;
  messages: IMessage[];
}

export interface IMessage {
  id: number;
  action: string;
  senderDisplayName: string;
  subject: string;
  bodyHtml: string;
  receivedAt: string;
  ticketId: number;
  messageId: string;
  status: string;
  senderEmail: string;
  bodyPlain: string;
  rawPath: string;
  createdAt: string;
}

export interface ITicketOptions {
  status: TicketStatus;
  pageSize: number;
  pageIndex: number;
}
