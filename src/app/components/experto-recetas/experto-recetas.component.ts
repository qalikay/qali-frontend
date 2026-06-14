import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CurrencyPipe } from '@angular/common';

import { AuthService } from '../../services/auth.service';
import { RecetaService } from '../../services/receta.service';
import { Receta } from '../../models/receta.model';

@Component({
  selector: 'app-experto-recetas',
  standalone: true,
  imports: [
    RouterLink,
    MatButtonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    CurrencyPipe,
  ],
  templateUrl: './experto-recetas.component.html',
  styleUrl: './experto-recetas.component.css',
})
export class ExpertoRecetasComponent implements OnInit {
  recetas: Receta[] = [];
  cargando = true;
  mensaje = '';
  columnas = ['titulo', 'categoria', 'estado', 'precio', 'acciones'];

  constructor(
    private recetaService: RecetaService,
    private auth: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    if (!this.auth.esExperto()) {
      this.router.navigate(['/login']);
      return;
    }
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;
    this.recetaService.getMisRecetas().subscribe({
      next: (data) => {
        this.recetas = data;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.mensaje = 'No se pudieron cargar tus recetas. Verifica que estes logueado como experto.';
      },
    });
  }

  publicar(id: number): void {
    this.recetaService.publicar(id).subscribe({
      next: () => {
        this.snackBar.open('Receta publicada', 'Cerrar', { duration: 3000 });
        this.cargar();
      },
      error: () => {
        this.snackBar.open('No se pudo publicar la receta', 'Cerrar', { duration: 3000 });
      },
    });
  }

  archivar(id: number): void {
    this.recetaService.archivar(id).subscribe({
      next: () => {
        this.snackBar.open('Receta archivada', 'Cerrar', { duration: 3000 });
        this.cargar();
      },
      error: () => {
        this.snackBar.open('No se pudo archivar la receta', 'Cerrar', { duration: 3000 });
      },
    });
  }

  eliminar(id: number): void {
    if (!confirm('Eliminar esta receta?')) {
      return;
    }
    this.recetaService.eliminar(id).subscribe({
      next: () => {
        this.snackBar.open('Receta eliminada', 'Cerrar', { duration: 3000 });
        this.cargar();
      },
      error: () => {
        this.snackBar.open('No se pudo eliminar la receta', 'Cerrar', { duration: 3000 });
      },
    });
  }
}
