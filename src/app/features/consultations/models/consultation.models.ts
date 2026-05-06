export type EstadoConsulta = 'ABIERTA' | 'CERRADA';
export type RemitenteMensaje = 'CLIENTE' | 'EXPERTO';

export interface MensajeDTO {
  id: number;
  contenido: string;
  remitente: RemitenteMensaje;
  fechaEnvio: string;
}

export interface ClienteMini {
  id: number;
  nombres: string;
  apellidos: string;
  username?: string;
}

export interface ExpertoMini {
  id: number;
  nombres: string;
  apellidos: string;
  username?: string;
  especialidad?: { id: number; nombre: string };
}

export interface Consulta {
  id: number;
  asunto: string;
  estado: EstadoConsulta;
  fechaCreacion?: string;
  cliente?: ClienteMini;
  experto?: ExpertoMini;
  mensajes?: MensajeDTO[];
}

export interface CrearConsultaRequest {
  asunto: string;
  expertoId: number;
  mensajeInicial?: string;
}
