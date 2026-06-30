import { Component, OnInit } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { AdminService } from '../../../../services/admin.service';
import { CategoriaService } from '../../../../services/categoria.service';
import { EspecialidadService } from '../../../../services/especialidad.service';
import { RecetaService } from '../../../../services/receta.service';
import { InsumoService } from '../../../../services/insumo.service';
import { ExpertoService } from '../../../../services/experto.service';
import { Insumo } from '../../../../models/insumo.model';
import { Orden } from '../../../../models/orden.model';
import { AdminDashboardDatos } from '../admin-stats.util';
import { AdminKpiResumenComponent } from '../admin-kpi-resumen/admin-kpi-resumen.component';
import { AdminGraficoPlataformaComponent } from '../admin-grafico-plataforma/admin-grafico-plataforma.component';
import { AdminGraficoOrdenesComponent } from '../admin-grafico-ordenes/admin-grafico-ordenes.component';

const DATOS_VACIOS: AdminDashboardDatos = {
  categorias: 0,
  especialidades: 0,
  clientes: 0,
  expertos: 0,
  recetas: 0,
  insumos: 0,
  insumosDisponibles: 0,
  ordenes: [],
};

/**
 * PARTE 1 — Integrante 1 (panel admin)
 * Contenedor, carga de datos y layout de la seccion de graficos.
 */
@Component({
  selector: 'app-admin-graficos-panel',
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    AdminKpiResumenComponent,
    AdminGraficoPlataformaComponent,
    AdminGraficoOrdenesComponent,
  ],
  templateUrl: './admin-graficos-panel.component.html',
  styleUrl: './admin-graficos-panel.component.css',
})
export class AdminGraficosPanelComponent implements OnInit {
  datos: AdminDashboardDatos = { ...DATOS_VACIOS };
  cargando = true;
  mensaje = '';
  avisoOrdenes = '';

  constructor(
    private adminService: AdminService,
    private categoriaService: CategoriaService,
    private especialidadService: EspecialidadService,
    private recetaService: RecetaService,
    private insumoService: InsumoService,
    private expertoService: ExpertoService,
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando = true;
    this.mensaje = '';
    this.avisoOrdenes = '';

    forkJoin({
      categorias: this.categoriaService.listar().pipe(catchError(() => of([]))),
      especialidades: this.especialidadService.listar().pipe(catchError(() => of([]))),
      clientes: this.adminService.listarClientes().pipe(catchError(() => of([]))),
      expertos: this.expertoService.listar().pipe(catchError(() => of([]))),
      recetas: this.recetaService.getRecetas().pipe(catchError(() => of([]))),
      insumos: this.insumoService.getInsumos().pipe(catchError(() => of([]))),
      ordenes: this.adminService.listarOrdenes().pipe(
        catchError(() => {
          this.avisoOrdenes = 'No se pudieron cargar las ordenes. Reinicia el backend si acabas de actualizar.';
          return of([] as Orden[]);
        }),
      ),
    }).subscribe({
      next: (res) => {
        this.datos = {
          categorias: res.categorias.length,
          especialidades: res.especialidades.length,
          clientes: res.clientes.length,
          expertos: res.expertos.length,
          recetas: res.recetas.length,
          insumos: res.insumos.length,
          insumosDisponibles: res.insumos.filter((i: Insumo) => i.estado === 'DISPONIBLE').length,
          ordenes: res.ordenes,
        };
        this.cargando = false;
        if (
          res.categorias.length === 0 &&
          res.clientes.length === 0 &&
          res.recetas.length === 0
        ) {
          this.mensaje = 'No se pudieron cargar las estadisticas. Verifica que el backend este activo.';
        }
      },
      error: () => {
        this.cargando = false;
        this.mensaje = 'No se pudieron cargar las estadisticas. Verifica que el backend este activo.';
      },
    });
  }
}
