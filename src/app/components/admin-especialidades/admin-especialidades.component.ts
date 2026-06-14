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
import { EspecialidadService } from '../../services/especialidad.service';
import { Especialidad } from '../../models/especialidad.model';

@Component({
  selector: 'app-admin-especialidades',
  standalone: true,
  imports: [
    RouterLink, MatButtonModule, MatTableModule, MatProgressSpinnerModule,
    MatFormFieldModule, MatInputModule, MatSnackBarModule, MatCardModule, FormsModule,
  ],
  templateUrl: './admin-especialidades.component.html',
  styleUrl: './admin-especialidades.component.css',
})
export class AdminEspecialidadesComponent implements OnInit {
  especialidades: Especialidad[] = [];
  cargando = true;
  mensaje = '';
  columnas = ['nombre', 'descripcion', 'acciones'];
  editandoId: number | null = null;
  form = { nombre: '', descripcion: '' };

  constructor(
    private especialidadService: EspecialidadService,
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
    this.especialidadService.listar().subscribe({
      next: (data) => { this.especialidades = data; this.cargando = false; },
      error: () => { this.cargando = false; this.mensaje = 'No se pudieron cargar las especialidades.'; },
    });
  }

  editar(esp: Especialidad): void {
    this.editandoId = esp.id;
    this.form = { nombre: esp.nombre, descripcion: esp.descripcion ?? '' };
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
      ? this.especialidadService.actualizar({ id: this.editandoId, ...datos })
      : this.especialidadService.crear(datos);
    req.subscribe({
      next: () => {
        this.snackBar.open(this.editandoId ? 'Especialidad actualizada' : 'Especialidad creada', 'Cerrar', { duration: 3000 });
        this.cancelar();
        this.cargar();
      },
      error: () => this.snackBar.open('No se pudo guardar', 'Cerrar', { duration: 3000 }),
    });
  }

  eliminar(id: number): void {
    if (!confirm('Eliminar esta especialidad?')) return;
    this.especialidadService.eliminar(id).subscribe({
      next: () => {
        this.snackBar.open('Especialidad eliminada', 'Cerrar', { duration: 3000 });
        this.cargar();
      },
      error: () => this.snackBar.open('No se pudo eliminar', 'Cerrar', { duration: 3000 }),
    });
  }
}
