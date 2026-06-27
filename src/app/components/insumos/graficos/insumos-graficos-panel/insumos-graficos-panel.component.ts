import { Component, Input } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { Insumo } from '../../../../models/insumo.model';
import { InsumosKpiResumenComponent } from '../insumos-kpi-resumen/insumos-kpi-resumen.component';
import { InsumosGraficoCategoriasComponent } from '../insumos-grafico-categorias/insumos-grafico-categorias.component';
import { InsumosGraficoDistribucionComponent } from '../insumos-grafico-distribucion/insumos-grafico-distribucion.component';

/**
 * PARTE 1 — Integrante 1
 * Responsable: contenedor, layout y estados (cargando / vacio) de la seccion de graficos.
 * Archivos a modificar: insumos-graficos-panel.component.{html,ts,css}
 *
 * NO tocar import.sql — eso queda fuera del trabajo del equipo frontend.
 */
@Component({
  selector: 'app-insumos-graficos-panel',
  standalone: true,
  imports: [
    MatDividerModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatIconModule,
    InsumosKpiResumenComponent,
    InsumosGraficoCategoriasComponent,
    InsumosGraficoDistribucionComponent,
  ],
  templateUrl: './insumos-graficos-panel.component.html',
  styleUrl: './insumos-graficos-panel.component.css',
})
export class InsumosGraficosPanelComponent {
  @Input({ required: true }) insumos: Insumo[] = [];
  @Input() cargando = false;
}
