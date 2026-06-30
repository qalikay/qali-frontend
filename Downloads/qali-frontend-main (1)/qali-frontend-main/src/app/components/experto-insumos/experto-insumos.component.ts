import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CurrencyPipe } from '@angular/common';

import { AuthService } from '../../services/auth.service';
import { InsumoService } from '../../services/insumo.service';
import { Insumo } from '../../models/insumo.model';

@Component({
  selector: 'app-experto-insumos',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatTableModule, MatProgressSpinnerModule, MatSnackBarModule, CurrencyPipe],
  templateUrl: './experto-insumos.component.html',
  styleUrl: './experto-insumos.component.css',
})
export class ExpertoInsumosComponent implements OnInit {
  insumos: Insumo[] = [];
  cargando = true;
  mensaje = '';
  columnas = ['nombre', 'categoria', 'tipo', 'stock', 'precio', 'estado', 'acciones'];

  constructor(
    private insumoService: InsumoService,
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
    this.insumoService.getMisInsumos().subscribe({
      next: (data) => {
        this.insumos = data;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.mensaje = 'No se pudieron cargar tus insumos.';
      },
    });
  }

  eliminar(id: number): void {
    if (!confirm('Eliminar este insumo?')) return;
    this.insumoService.eliminar(id).subscribe({
      next: () => {
        this.snackBar.open('Insumo eliminado', 'Cerrar', { duration: 3000 });
        this.cargar();
      },
      error: () => this.snackBar.open('No se pudo eliminar', 'Cerrar', { duration: 3000 }),
    });
  }
}
