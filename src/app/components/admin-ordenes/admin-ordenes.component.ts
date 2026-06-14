import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-ordenes',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatFormFieldModule, MatInputModule, MatCardModule, FormsModule],
  templateUrl: './admin-ordenes.component.html',
  styleUrl: './admin-ordenes.component.css',
})
export class AdminOrdenesComponent {
  ordenId: number | null = null;

  constructor(
    public auth: AuthService,
    private router: Router,
  ) {
    if (!this.auth.esAdmin()) {
      this.router.navigate(['/login']);
    }
  }

  verOrden(): void {
    if (!this.ordenId || this.ordenId <= 0) return;
    this.router.navigate(['/ordenes', this.ordenId]);
  }
}
