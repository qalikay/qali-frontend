import { Component, Input, OnChanges } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { Insumo } from '../../../../models/insumo.model';
import { agruparInsumos, InsumoStatItem } from '../insumos-stats.util';

/**
 * PARTE 3 — Integrante 3
 * Responsable: grafico de barras por categoria (mat-progress-bar).
 * Archivos a modificar: insumos-grafico-categorias.component.{html,ts,css}
 */
@Component({
  selector: 'app-insumos-grafico-categorias',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatProgressBarModule],
  templateUrl: './insumos-grafico-categorias.component.html',
  styleUrl: './insumos-grafico-categorias.component.css',
})
export class InsumosGraficoCategoriasComponent implements OnChanges {
  @Input({ required: true }) insumos: Insumo[] = [];

  items: InsumoStatItem[] = [];

  ngOnChanges(): void {
    this.items = agruparInsumos(this.insumos, (i) => i.categoria?.nombre ?? 'Sin categoria');
  }
}
