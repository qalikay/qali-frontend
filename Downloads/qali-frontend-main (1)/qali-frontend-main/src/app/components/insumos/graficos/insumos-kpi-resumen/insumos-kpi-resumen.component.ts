import { Component, Input, OnChanges } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { Insumo } from '../../../../models/insumo.model';
import { calcularKpiInsumos, InsumoKpiResumen } from '../insumos-stats.util';

/**
 * PARTE 2 — Integrante 2
 * Responsable: tarjetas KPI del resumen de insumos.
 * Archivos a modificar: insumos-kpi-resumen.component.{html,ts,css}
 */
@Component({
  selector: 'app-insumos-kpi-resumen',
  standalone: true,
  imports: [MatCardModule, MatIconModule, CurrencyPipe],
  templateUrl: './insumos-kpi-resumen.component.html',
  styleUrl: './insumos-kpi-resumen.component.css',
})
export class InsumosKpiResumenComponent implements OnChanges {
  @Input({ required: true }) insumos: Insumo[] = [];

  kpi: InsumoKpiResumen = {
    total: 0,
    disponibles: 0,
    agotados: 0,
    precioPromedio: 0,
    stockTotal: 0,
  };

  ngOnChanges(): void {
    this.kpi = calcularKpiInsumos(this.insumos);
  }
}
