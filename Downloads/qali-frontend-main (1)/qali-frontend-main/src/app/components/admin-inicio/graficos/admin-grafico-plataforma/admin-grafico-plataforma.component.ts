import { Component, Input, OnChanges } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { AdminDashboardDatos, AdminStatItem, itemsPlataforma } from '../admin-stats.util';

/**
 * PARTE 3 — Integrante 3 (panel admin)
 * Grafico de barras: contenido general de la plataforma.
 */
@Component({
  selector: 'app-admin-grafico-plataforma',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatProgressBarModule],
  templateUrl: './admin-grafico-plataforma.component.html',
  styleUrl: './admin-grafico-plataforma.component.css',
})
export class AdminGraficoPlataformaComponent implements OnChanges {
  @Input({ required: true }) datos!: AdminDashboardDatos;

  items: AdminStatItem[] = [];

  ngOnChanges(): void {
    if (this.datos) {
      this.items = itemsPlataforma(this.datos);
    }
  }
}
