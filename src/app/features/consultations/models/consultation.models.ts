export type EstadoConsulta =
  | 'SOLICITADA'
  | 'ACEPTADA'
  | 'RECHAZADA'
  | 'COMPLETADA'
  | 'CANCELADA';

export interface ConsultationParticipant {
  id: number;
  firstName: string;
  lastName: string;
  specialty?: string;
}

export interface MessageRequest {
  content: string;
}

export interface MessageResponse {
  id: number;
  content: string;
  senderId: number;
  senderName: string;
  sentAt: string;
}

export interface ConsultationCreateRequest {
  expertId: number;
  subject: string;
  initialMessage: string;
}

export interface ConsultationResponse {
  id: number;
  subject: string;
  status: EstadoConsulta;
  client: ConsultationParticipant;
  expert: ConsultationParticipant;
  messages: MessageResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface ConsultationSummary {
  id: number;
  subject: string;
  status: EstadoConsulta;
  client: ConsultationParticipant;
  expert: ConsultationParticipant;
  lastMessageAt?: string;
  lastMessagePreview?: string;
  unreadCount?: number;
  createdAt: string;
}
