import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';

import { ExpertoService } from '../../services/experto.service';
import { EspecialidadService } from '../../services/especialidad.service';
import { Experto } from '../../models/experto.model';
import { Especialidad } from '../../models/especialidad.model';
import { AuthService } from '../../services/auth.service';
import { ExpertosResumenKpiComponent } from './graficos/expertos-resumen-kpi/expertos-resumen-kpi.component';
import { ExpertosGraficoEspecialidadComponent } from './graficos/expertos-grafico-especialidad/expertos-grafico-especialidad.component';
@Component({
  selector: 'app-expertos',
  standalone: true,
  imports: [
    RouterLink, MatButtonModule, MatTableModule, MatProgressSpinnerModule,
    MatFormFieldModule, MatSelectModule, MatIconModule, MatCardModule, FormsModule,
    ExpertosResumenKpiComponent, ExpertosGraficoEspecialidadComponent,
  ],
  templateUrl: './expertos.component.html',
  styleUrl: './expertos.component.css',
})
export class ExpertosComponent implements OnInit {
  expertos: Experto[] = [];
  especialidades: Especialidad[] = [];
  filtroEspecialidad: number | null = null;
  cargando = true;
  mensaje = '';
  columnas = ['nombre', 'especialidad', 'experiencia', 'accion'];

  constructor(
    private expertoService: ExpertoService,
    private especialidadService: EspecialidadService,
    public auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.especialidadService.listar().subscribe({ next: (data) => (this.especialidades = data) });
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;
    this.expertoService.listar(this.filtroEspecialidad ?? undefined).subscribe({
      next: (data) => { this.expertos = data; this.cargando = false; },
      error: () => { this.cargando = false; this.mensaje = 'No se pudieron cargar los expertos.'; },
    });
  }
}
