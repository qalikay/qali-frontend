import { Component, Input, OnChanges } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { AdminDashboardDatos, calcularKpiAdmin, AdminKpiResumen } from '../admin-stats.util';

/**
 * PARTE 2 — Integrante 2 (panel admin)
 * Tarjetas KPI del dashboard de administracion.
 */
@Component({
  selector: 'app-admin-kpi-resumen',
  standalone: true,
  imports: [MatCardModule, MatIconModule, CurrencyPipe],
  templateUrl: './admin-kpi-resumen.component.html',
  styleUrl: './admin-kpi-resumen.component.css',
})
export class AdminKpiResumenComponent implements OnChanges {
  @Input({ required: true }) datos!: AdminDashboardDatos;

  kpi: AdminKpiResumen = {
    categorias: 0,
    especialidades: 0,
    clientes: 0,
    expertos: 0,
    recetas: 0,
    insumos: 0,
    ordenes: 0,
    ventasTotales: 0,
  };

  ngOnChanges(): void {
    if (this.datos) {
      this.kpi = calcularKpiAdmin(this.datos);
    }
  }
}
