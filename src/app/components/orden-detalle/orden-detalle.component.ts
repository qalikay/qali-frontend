import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { CurrencyPipe, DatePipe } from '@angular/common';

import { OrdenService } from '../../services/orden.service';
import { Orden } from '../../models/orden.model';

@Component({
  selector: 'app-orden-detalle',
  standalone: true,
  imports: [
    RouterLink, MatButtonModule, MatCardModule, MatProgressSpinnerModule,
    MatTableModule, CurrencyPipe, DatePipe,
  ],
  templateUrl: './orden-detalle.component.html',
  styleUrl: './orden-detalle.component.css',
})
export class OrdenDetalleComponent implements OnInit {
  orden: Orden | null = null;
  cargando = true;
  mensaje = '';
  columnas = ['descripcion', 'tipo', 'cantidad', 'precio', 'subtotal'];

  constructor(
    private route: ActivatedRoute,
    private ordenService: OrdenService,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.ordenService.getOrden(id).subscribe({
      next: (data) => { this.orden = data; this.cargando = false; },
      error: () => { this.cargando = false; this.mensaje = 'No se encontro la orden.'; },
    });
  }
}
