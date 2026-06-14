import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CurrencyPipe } from '@angular/common';

import { InsumoService } from '../../services/insumo.service';
import { Insumo } from '../../models/insumo.model';

@Component({
  selector: 'app-insumo-detalle',
  standalone: true,
  imports: [
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    CurrencyPipe,
  ],
  templateUrl: './insumo-detalle.component.html',
  styleUrl: './insumo-detalle.component.css',
})
export class InsumoDetalleComponent implements OnInit {
  insumo: Insumo | null = null;
  cargando = true;
  mensaje = '';

  constructor(
    private route: ActivatedRoute,
    private insumoService: InsumoService,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.insumoService.getInsumo(id).subscribe({
      next: (data) => {
        this.insumo = data;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.mensaje = 'No se encontro el insumo.';
      },
    });
  }
}
