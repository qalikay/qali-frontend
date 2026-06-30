import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { CategoriaService } from '../../services/categoria.service';
import { Categoria } from '../../models/categoria.model';

@Component({
  selector: 'app-admin-categorias',
  standalone: true,
  imports: [
    RouterLink, MatButtonModule, MatTableModule, MatProgressSpinnerModule,
    MatFormFieldModule, MatInputModule, MatSnackBarModule, MatCardModule, FormsModule,
  ],
  templateUrl: './admin-categorias.component.html',
  styleUrl: './admin-categorias.component.css',
})
export class AdminCategoriasComponent implements OnInit {
  categorias: Categoria[] = [];
  cargando = true;
  mensaje = '';
  columnas = ['nombre', 'descripcion', 'acciones'];
  editandoId: number | null = null;
  form = { nombre: '', descripcion: '' };

  constructor(
    private categoriaService: CategoriaService,
    private auth: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    if (!this.auth.esAdmin()) {
      this.router.navigate(['/login']);
      return;
    }
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;
    this.categoriaService.listar().subscribe({
      next: (data) => { this.categorias = data; this.cargando = false; },
      error: () => { this.cargando = false; this.mensaje = 'No se pudieron cargar las categorias.'; },
    });
  }

  editar(cat: Categoria): void {
    this.editandoId = cat.id;
    this.form = { nombre: cat.nombre, descripcion: cat.descripcion ?? '' };
  }

  cancelar(): void {
    this.editandoId = null;
    this.form = { nombre: '', descripcion: '' };
  }

  guardar(): void {
    if (!this.form.nombre.trim()) {
      this.snackBar.open('El nombre es obligatorio', 'Cerrar', { duration: 3000 });
      return;
    }
    const datos = { nombre: this.form.nombre.trim(), descripcion: this.form.descripcion.trim() || undefined };
    const req = this.editandoId
      ? this.categoriaService.actualizar({ id: this.editandoId, ...datos })
      : this.categoriaService.crear(datos);
    req.subscribe({
      next: () => {
        this.snackBar.open(this.editandoId ? 'Categoria actualizada' : 'Categoria creada', 'Cerrar', { duration: 3000 });
        this.cancelar();
        this.cargar();
      },
      error: () => this.snackBar.open('No se pudo guardar', 'Cerrar', { duration: 3000 }),
    });
  }

  eliminar(id: number): void {
    if (!confirm('Eliminar esta categoria?')) return;
    this.categoriaService.eliminar(id).subscribe({
      next: () => {
        this.snackBar.open('Categoria eliminada', 'Cerrar', { duration: 3000 });
        this.cargar();
      },
      error: () => this.snackBar.open('No se pudo eliminar', 'Cerrar', { duration: 3000 }),
    });
  }
}
