import {Component, Input, OnChanges} from '@angular/core';
import {CurrencyPipe} from '@angular/common';
import {Receta} from '../../../../models/receta.model';


import {MatCardModule} from '@angular/material/card';
import {calcularKpiRecetas, RecetaKpiResumen} from '../recetas-stats.util';
import {MatIconModule} from '@angular/material/icon';
@Component({
  selector: 'app-recetas-resumen-kpi',
  standalone: true,
  imports: [
    MatCardModule, MatIconModule, CurrencyPipe

  ],
  templateUrl: './recetas-resumen-kpi.html',
  styleUrl: './recetas-resumen-kpi.css',
})
export class RecetasResumenKpiComponent implements OnChanges {

  @Input({ required: true }) recetas: Receta[] = [];

  kpi: RecetaKpiResumen = {
    total: 0,
    categoriasdistintas: 0,
    precioPromedio: 0,
    precioMaximo:  0,
  };

  ngOnChanges(): void {
    this.kpi= calcularKpiRecetas(this.recetas);
  }

}
