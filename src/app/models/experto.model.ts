/** Modelo que refleja ExpertoDTO del backend */
export interface Experto {
  id: number;
  nombres: string;
  apellidos: string;
  telefono?: string;
  trayectoria?: string;
  anosExperiencia?: number;
  username?: string;
}
