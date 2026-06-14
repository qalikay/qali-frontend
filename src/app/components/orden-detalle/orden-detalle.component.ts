import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CurrencyPipe, DatePipe } from '@angular/common';

import { OrdenService } from '../../services/orden.service';
import { AuthService } from '../../services/auth.service';
import { Orden } from '../../models/orden.model';

@Component({
  selector: 'app-orden-detalle',
  standalone: true,
  imports: [
    RouterLink, MatButtonModule, MatCardModule, MatProgressSpinnerModule,
    MatTableModule, MatSnackBarModule, CurrencyPipe, DatePipe,
  ],
  templateUrl: './orden-detalle.component.html',
  styleUrl: './orden-detalle.component.css',
})
export class OrdenDetalleComponent implements OnInit {
  orden: Orden | null = null;
  cargando = true;
  mensaje = '';
  cambiandoEstado = false;
  columnas = ['descripcion', 'tipo', 'cantidad', 'precio', 'subtotal'];

  constructor(
    private route: ActivatedRoute,
    private ordenService: OrdenService,
    public auth: AuthService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.cargar(id);
  }

  cargar(id: number): void {
    this.cargando = true;
    this.ordenService.getOrden(id).subscribe({
      next: (data) => { this.orden = data; this.cargando = false; },
      error: () => { this.cargando = false; this.mensaje = 'No se encontro la orden.'; },
    });
  }

  cambiarEstado(estado: string): void {
    if (!this.orden || this.cambiandoEstado) return;
    if (!confirm(`Marcar la orden #${this.orden.id} como ${estado}?`)) return;
    this.cambiandoEstado = true;
    this.ordenService.cambiarEstado(this.orden.id, estado).subscribe({
      next: (data) => {
        this.orden = data;
        this.cambiandoEstado = false;
        this.snackBar.open(`Orden marcada como ${estado}`, 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.cambiandoEstado = false;
        this.snackBar.open('No se pudo cambiar el estado', 'Cerrar', { duration: 3000 });
      },
    });
  }
}
