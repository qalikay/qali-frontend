import { Component, Input, OnChanges } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { Experto } from '../../../../models/experto.model';

/**
 * Integrante 2 — Parte A
 * Responsable: tarjetas KPI del directorio de expertos.
 * Archivos a modificar: expertos-resumen-kpi.component.{html,ts,css}
 */
export interface ExpertoKpiResumen {
  total: number;
  especialidadesDistintas: number;
  promedioAnosExperiencia: number;
  expertoMasExperiencia: string;
}

@Component({
  selector: 'app-expertos-resumen-kpi',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  templateUrl: './expertos-resumen-kpi.component.html',
  styleUrl: './expertos-resumen-kpi.component.css',
})
export class ExpertosResumenKpiComponent implements OnChanges {
  @Input({ required: true }) expertos: Experto[] = [];

  kpi: ExpertoKpiResumen = {
    total: 0,
    especialidadesDistintas: 0,
    promedioAnosExperiencia: 0,
    expertoMasExperiencia: '-',
  };

  ngOnChanges(): void {
    this.kpi = this.calcularKpi(this.expertos);
  }

  private calcularKpi(expertos: Experto[]): ExpertoKpiResumen {
    const total = expertos.length;

    const especialidades = new Set(
      expertos
        .map((e) => e.especialidad?.nombre)
        .filter((nombre): nombre is string => !!nombre),
    );

    const promedioAnosExperiencia =
      total > 0
        ? expertos.reduce((sum, e) => sum + (e.anosExperiencia ?? 0), 0) / total
        : 0;

    let expertoMasExperiencia = '-';
    if (total > 0) {
      const top = expertos.reduce((max, e) =>
        (e.anosExperiencia ?? 0) > (max.anosExperiencia ?? 0) ? e : max,
      );
      expertoMasExperiencia = `${top.nombres} ${top.apellidos}`.trim() || '-';
    }

    return {
      total,
      especialidadesDistintas: especialidades.size,
      promedioAnosExperiencia: Math.round(promedioAnosExperiencia * 10) / 10,
      expertoMasExperiencia,
    };
  }
}
