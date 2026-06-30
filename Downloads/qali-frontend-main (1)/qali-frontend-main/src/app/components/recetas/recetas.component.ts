import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';

import { RecetaService } from '../../services/receta.service';
import { CategoriaService } from '../../services/categoria.service';
import { AuthService } from '../../services/auth.service';
import { Receta } from '../../models/receta.model';
import { Categoria } from '../../models/categoria.model';
import {RecetasResumenKpiComponent} from './graficos/recetas-resumen-kpi/recetas-resumen-kpi';

@Component({
  selector: 'app-recetas',
  standalone: true,
  imports: [
    RouterLink, MatButtonModule, MatProgressSpinnerModule, MatTableModule,
    MatFormFieldModule, MatSelectModule, MatInputModule, MatIconModule, MatCardModule,
    FormsModule, CurrencyPipe, RecetasResumenKpiComponent,
  ],
  templateUrl: './recetas.component.html',
  styleUrl: './recetas.component.css',
})
export class RecetasComponent implements OnInit {
  recetas: Receta[] = [];
  categorias: Categoria[] = [];
  filtroQ = '';
  filtroCategoria: number | null = null;
  cargando = true;
  mensaje = '';
  columnas = ['titulo', 'categoria', 'precio', 'experto', 'accion'];

  constructor(
    private recetaService: RecetaService,
    private categoriaService: CategoriaService,
    public auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.categoriaService.listar().subscribe({ next: (data) => (this.categorias = data) });
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;
    this.mensaje = '';
    this.recetaService.getRecetas({
      q: this.filtroQ || undefined,
      categoriaId: this.filtroCategoria ?? undefined,
    }).subscribe({
      next: (data) => {
        this.recetas = data;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.mensaje =
          'No se pudieron cargar las recetas. Verifica que el backend este corriendo en localhost:8080.';
      },
    });
  }

  limpiarFiltros(): void {
    this.filtroQ = '';
    this.filtroCategoria = null;
    this.cargar();
  }
}
