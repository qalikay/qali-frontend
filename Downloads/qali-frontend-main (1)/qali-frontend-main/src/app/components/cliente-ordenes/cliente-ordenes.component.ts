import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CurrencyPipe, DatePipe } from '@angular/common';

import { AuthService } from '../../services/auth.service';
import { OrdenService } from '../../services/orden.service';
import { Orden } from '../../models/orden.model';

@Component({
  selector: 'app-cliente-ordenes',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatTableModule, MatProgressSpinnerModule, CurrencyPipe, DatePipe],
  templateUrl: './cliente-ordenes.component.html',
  styleUrl: './cliente-ordenes.component.css',
})
export class ClienteOrdenesComponent implements OnInit {
  ordenes: Orden[] = [];
  cargando = true;
  mensaje = '';
  columnas = ['id', 'fecha', 'total', 'estado', 'metodo', 'accion'];

  constructor(
    private ordenService: OrdenService,
    private auth: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    if (!this.auth.esCliente()) {
      this.router.navigate(['/login']);
      return;
    }
    this.ordenService.getMisOrdenes().subscribe({
      next: (data) => { this.ordenes = data; this.cargando = false; },
      error: () => { this.cargando = false; this.mensaje = 'No se pudieron cargar tus ordenes.'; },
    });
  }
}
