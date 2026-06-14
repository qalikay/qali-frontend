import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';

import { InsumoService } from '../../services/insumo.service';
import { CategoriaService } from '../../services/categoria.service';
import { AuthService } from '../../services/auth.service';
import { Insumo } from '../../models/insumo.model';
import { Categoria } from '../../models/categoria.model';

const TIPOS_INSUMO = ['HIERBA', 'ACEITE', 'EXTRACTO', 'POLVO', 'OTRO'];

@Component({
  selector: 'app-insumos',
  standalone: true,
  imports: [
    RouterLink, MatButtonModule, MatProgressSpinnerModule, MatTableModule,
    MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule, CurrencyPipe,
  ],
  templateUrl: './insumos.component.html',
  styleUrl: './insumos.component.css',
})
export class InsumosComponent implements OnInit {
  insumos: Insumo[] = [];
  categorias: Categoria[] = [];
  tipos = TIPOS_INSUMO;
  filtroQ = '';
  filtroCategoria: number | null = null;
  filtroTipo: string | null = null;
  cargando = true;
  mensaje = '';
  columnas = ['nombre', 'categoria', 'tipo', 'precio', 'stock', 'estado', 'accion'];

  constructor(
    private insumoService: InsumoService,
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
    this.insumoService.getInsumos({
      q: this.filtroQ || undefined,
      categoriaId: this.filtroCategoria ?? undefined,
      tipo: this.filtroTipo ?? undefined,
    }).subscribe({
      next: (data) => {
        this.insumos = data;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.mensaje =
          'No se pudieron cargar los insumos. Verifica que el backend este corriendo en localhost:8080.';
      },
    });
  }

  limpiarFiltros(): void {
    this.filtroQ = '';
    this.filtroCategoria = null;
    this.filtroTipo = null;
    this.cargar();
  }
}
