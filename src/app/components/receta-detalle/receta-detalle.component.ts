import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CurrencyPipe } from '@angular/common';

import { RecetaService } from '../../services/receta.service';

@Component({
  selector: 'app-receta-detalle',
  standalone: true,
  imports: [
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    CurrencyPipe,
  ],
  templateUrl: './receta-detalle.component.html',
  styleUrl: './receta-detalle.component.css',
})
export class RecetaDetalleComponent implements OnInit {
  receta: any = null;
  cargando = true;
  mensaje = '';

  constructor(
    private route: ActivatedRoute,
    private recetaService: RecetaService,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.recetaService.getReceta(id).subscribe({
      next: (data) => {
        this.receta = data;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.mensaje = 'No se encontro la receta.';
      },
    });
  }
}
