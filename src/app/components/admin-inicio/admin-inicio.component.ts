import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../services/auth.service';
import { AdminGraficosPanelComponent } from './graficos/admin-graficos-panel/admin-graficos-panel.component';

@Component({
  selector: 'app-admin-inicio',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatButtonModule, MatIconModule, AdminGraficosPanelComponent],
  templateUrl: './admin-inicio.component.html',
  styleUrl: './admin-inicio.component.css',
})
export class AdminInicioComponent {
  constructor(
    public auth: AuthService,
    private router: Router,
  ) {
    if (!this.auth.esAdmin()) {
      this.router.navigate(['/login']);
    }
  }
}
