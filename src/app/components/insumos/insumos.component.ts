import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { CurrencyPipe } from '@angular/common';

import { InsumoService } from '../../services/insumo.service';
import { AuthService } from '../../services/auth.service';
import { Insumo } from '../../models/insumo.model';

@Component({
  selector: 'app-insumos',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatProgressSpinnerModule, MatTableModule, CurrencyPipe],
  templateUrl: './insumos.component.html',
  styleUrl: './insumos.component.css',
})
export class InsumosComponent implements OnInit {
  insumos: Insumo[] = [];
  cargando = true;
  mensaje = '';
  columnas = ['nombre', 'categoria', 'precio', 'stock', 'estado', 'accion'];

  constructor(
    private insumoService: InsumoService,
    public auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.insumoService.getInsumos().subscribe({
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
}
