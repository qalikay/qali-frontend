import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-experto-inicio',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatButtonModule],
  templateUrl: './experto-inicio.component.html',
  styleUrl: './experto-inicio.component.css',
})
export class ExpertoInicioComponent {
  constructor(public auth: AuthService) {}
}
