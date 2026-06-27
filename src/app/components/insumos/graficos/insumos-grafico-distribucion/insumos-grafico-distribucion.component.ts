import { Component, Input, OnChanges } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { Insumo } from '../../../../models/insumo.model';
import { agruparInsumos, InsumoStatItem } from '../insumos-stats.util';

/**
 * PARTE 4 — Integrante 4
 * Responsable: graficos por tipo y por estado (solo CSS + Angular Material).
 * Archivos a modificar: insumos-grafico-distribucion.component.{html,ts,css}
 */
@Component({
  selector: 'app-insumos-grafico-distribucion',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  templateUrl: './insumos-grafico-distribucion.component.html',
  styleUrl: './insumos-grafico-distribucion.component.css',
})
export class InsumosGraficoDistribucionComponent implements OnChanges {
  @Input({ required: true }) insumos: Insumo[] = [];

  itemsTipo: InsumoStatItem[] = [];
  itemsEstado: InsumoStatItem[] = [];

  ngOnChanges(): void {
    this.itemsTipo = agruparInsumos(this.insumos, (i) => i.tipo ?? 'OTRO');
    this.itemsEstado = agruparInsumos(this.insumos, (i) => i.estado ?? 'SIN ESTADO');
  }
}
