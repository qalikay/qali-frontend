import { Component, Input, OnChanges } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { AdminDashboardDatos, AdminStatItem, itemsOrdenesPorEstado } from '../admin-stats.util';

/**
 * PARTE 4 — Integrante 4 (panel admin)
 * Grafico de ordenes por estado (PAGADA, PENDIENTE, etc.).
 */
@Component({
  selector: 'app-admin-grafico-ordenes',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatProgressBarModule],
  templateUrl: './admin-grafico-ordenes.component.html',
  styleUrl: './admin-grafico-ordenes.component.css',
})
export class AdminGraficoOrdenesComponent implements OnChanges {
  @Input({ required: true }) datos!: AdminDashboardDatos;

  items: AdminStatItem[] = [];

  ngOnChanges(): void {
    if (this.datos) {
      this.items = itemsOrdenesPorEstado(this.datos.ordenes);
    }
  }
}
