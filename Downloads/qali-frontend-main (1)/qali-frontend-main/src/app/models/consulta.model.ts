import { Cliente } from './cliente.model';
import { Experto } from './experto.model';

export interface Mensaje {
  id: number;
  contenido: string;
  remitente: string;
  fechaEnvio?: string;
}

export interface Consulta {
  id: number;
  asunto: string;
  estado: string;
  fechaCreacion?: string;
  cliente?: Cliente;
  experto?: Experto;
  mensajes?: Mensaje[];
}

export interface CrearConsultaRequest {
  asunto: string;
  expertoId: number;
  mensajeInicial: string;
}
