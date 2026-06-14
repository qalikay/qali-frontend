import { Especialidad } from './especialidad.model';

/** Modelo que refleja ExpertoDTO del backend */
export interface Experto {
  id: number;
  nombres: string;
  apellidos: string;
  telefono?: string;
  trayectoria?: string;
  anosExperiencia?: number;
  especialidad?: Especialidad;
  username?: string;
}

export interface ActualizarExpertoRequest {
  nombres?: string;
  apellidos?: string;
  telefono?: string;
  trayectoria?: string;
  anosExperiencia?: number;
}
