import { Component, Input, OnChanges } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';

import { Experto } from '../../../../models/experto.model';

/**
 * Integrante 2 — Parte B
 * Responsable: grafico de expertos por especialidad (barras horizontales + chips).
 * Archivos a modificar: expertos-grafico-especialidad.component.{html,ts,css}
 */
export interface ExpertoBarraItem {
  experto: string;
  especialidad: string;
  anosExperiencia: number;
  porcentaje: number;
}

export interface EspecialidadChipItem {
  nombre: string;
  cantidad: number;
}

@Component({
  selector: 'app-expertos-grafico-especialidad',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatProgressBarModule, MatChipsModule],
  templateUrl: './expertos-grafico-especialidad.component.html',
  styleUrl: './expertos-grafico-especialidad.component.css',
})
export class ExpertosGraficoEspecialidadComponent implements OnChanges {
  @Input({ required: true }) expertos: Experto[] = [];

  barras: ExpertoBarraItem[] = [];
  chips: EspecialidadChipItem[] = [];

  ngOnChanges(): void {
    this.barras = this.construirBarras(this.expertos);
    this.chips = this.construirChips(this.expertos);
  }

  private construirBarras(expertos: Experto[]): ExpertoBarraItem[] {
    const maxAnos = Math.max(1, ...expertos.map((e) => e.anosExperiencia ?? 0));

    return expertos
      .map((e) => ({
        experto: `${e.nombres ?? ''} ${e.apellidos ?? ''}`.trim() || 'Sin nombre',
        especialidad: e.especialidad?.nombre ?? 'Sin especialidad',
        anosExperiencia: e.anosExperiencia ?? 0,
        porcentaje: Math.round(((e.anosExperiencia ?? 0) / maxAnos) * 100),
      }))
      .sort((a, b) => b.anosExperiencia - a.anosExperiencia);
  }

  private construirChips(expertos: Experto[]): EspecialidadChipItem[] {
    const mapa = new Map<string, number>();

    for (const e of expertos) {
      const nombre = e.especialidad?.nombre ?? 'Sin especialidad';
      mapa.set(nombre, (mapa.get(nombre) ?? 0) + 1);
    }

    return [...mapa.entries()]
      .map(([nombre, cantidad]) => ({ nombre, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad);
  }
}
