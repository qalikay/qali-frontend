import { Component } from '@angular/core';

import { AuthService } from '../../services/auth.service';
import { ClienteAccesosDestacadosComponent } from './widgets/cliente-accesos-destacados/cliente-accesos-destacados.component';

@Component({
  selector: 'app-cliente-inicio',
  standalone: true,
  imports: [ClienteAccesosDestacadosComponent],
  templateUrl: './cliente-inicio.component.html',
  styleUrl: './cliente-inicio.component.css',
})
export class ClienteInicioComponent {
  constructor(public auth: AuthService) {}
}
