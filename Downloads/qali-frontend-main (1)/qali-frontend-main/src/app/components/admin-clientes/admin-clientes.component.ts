import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../services/auth.service';
import { AdminService } from '../../services/admin.service';
import { Cliente } from '../../models/cliente.model';

@Component({
  selector: 'app-admin-clientes',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatTableModule, MatProgressSpinnerModule],
  templateUrl: './admin-clientes.component.html',
  styleUrl: './admin-clientes.component.css',
})
export class AdminClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  cargando = true;
  mensaje = '';
  columnas = ['nombre', 'telefono', 'username'];

  constructor(
    private adminService: AdminService,
    private auth: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    if (!this.auth.esAdmin()) {
      this.router.navigate(['/login']);
      return;
    }
    this.adminService.listarClientes().subscribe({
      next: (data) => { this.clientes = data; this.cargando = false; },
      error: () => { this.cargando = false; this.mensaje = 'No se pudieron cargar los clientes.'; },
    });
  }
}
