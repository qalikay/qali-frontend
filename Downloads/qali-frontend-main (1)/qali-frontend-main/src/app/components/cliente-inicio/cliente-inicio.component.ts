import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cliente-inicio',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatButtonModule],
  templateUrl: './cliente-inicio.component.html',
  styleUrl: './cliente-inicio.component.css',
})
export class ClienteInicioComponent {
  constructor(public auth: AuthService) {}
}
