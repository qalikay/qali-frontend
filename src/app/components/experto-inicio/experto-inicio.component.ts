import { Component } from '@angular/core';

import { AuthService } from '../../services/auth.service';
import { ExpertoResumenActividadComponent } from './widgets/experto-resumen-actividad/experto-resumen-actividad.component';

@Component({
  selector: 'app-experto-inicio',
  standalone: true,
  imports: [ExpertoResumenActividadComponent],
  templateUrl: './experto-inicio.component.html',
  styleUrl: './experto-inicio.component.css',
})
export class ExpertoInicioComponent {
  constructor(public auth: AuthService) {}
}
