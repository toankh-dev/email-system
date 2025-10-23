/**
 * API Request and Response Type Definitions
 * This file contains all API-related types for better type safety
 */

// ============================================
// POP3 Related Types
// ============================================

export interface IPop3RegisterRequest {
  message_box_id: string;
  email: string;
  password: string;
  pop3_server: string;
  pop3_port: number;
  use_ssl?: boolean;
}

export interface IPop3RegisterResponse {
  success: boolean;
  message?: string;
  detail?: string | IApiErrorDetail[];
  data?: {
    id: number;
    message_box_id: string;
    email: string;
    pop3_server: string;
    pop3_port: number;
    use_ssl: boolean;
    created_at: string;
  };
}

export interface IPop3FetchEmailRequest {
  message_box_id: string;
  account_id?: number;
}

export interface IPop3FetchEmailResponse {
  success: boolean;
  message?: string;
  data?: {
    fetched_count: number;
    new_emails: number;
  };
}

// ============================================
// Ticket Related Types
// ============================================

export interface IRecipient {
  id: number;
  messageId: number;
  recipientType: 'to' | 'cc' | 'bcc';
  email: string;
  displayName: string | null;
  createdAt: string;
}

export interface IAttachment {
  id: number;
  messageId: number;
  filename: string;
  contentType: string;
  size: number;
  path: string;
  createdAt: string;
}

export interface IComment {
  id: number;
  ticketId: number;
  userId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface IMessageHistory {
  id: number;
  ticketId: number;
  messageId: string;
  reason: string;
  action: string;
  createdAt: string;
}

export interface ITicketDetailMessage {
  id: number;
  ticketId: number;
  messageId: string;
  senderDisplayName: string;
  senderEmail: string;
  sender: string;
  action: string;
  status: string;
  subject: string;
  bodyPlain: string;
  bodyHtml: string;
  rawPath: string | null;
  receivedAt: string;
  createdAt: string;
  recipients: IRecipient[];
  attachments: IAttachment[];
  comments: IComment[];
  messageHistories: IMessageHistory[];
}

export interface ITicketDetailResponse {
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
  messages: ITicketDetailMessage[];
}

export interface IAddCommentRequest {
  ticket_id: number;
  message_id: number;
  content: string;
}

export interface IAddCommentResponse {
  success: boolean;
  message?: string;
  data?: IComment;
}

// ============================================
// Common API Response Types
// ============================================

export interface IApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

export interface IApiErrorDetail {
  msg: string;
  type?: string;
  loc?: string[];
}

export interface IApiErrorResponse {
  success: false;
  error: string;
  detail?: IApiErrorDetail[];
  message?: string;
}

export type IApiResponse<T = unknown> = IApiSuccessResponse<T> | IApiErrorResponse;

// ============================================
// Axios Response Wrapper
// ============================================

export interface IAxiosSuccessResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

export interface IAxiosErrorResponse {
  response?: {
    data: IApiErrorResponse;
    status: number;
    statusText: string;
    headers: Record<string, string>;
  };
  message: string;
  name: string;
}
