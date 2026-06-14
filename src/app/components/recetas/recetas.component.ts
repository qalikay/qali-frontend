import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { CurrencyPipe } from '@angular/common';

import { RecetaService } from '../../services/receta.service';
import { Receta } from '../../models/receta.model';

@Component({
  selector: 'app-recetas',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatProgressSpinnerModule, MatTableModule, CurrencyPipe],
  templateUrl: './recetas.component.html',
  styleUrl: './recetas.component.css',
})
export class RecetasComponent implements OnInit {
  recetas: Receta[] = [];
  cargando = true;
  mensaje = '';
  columnas = ['titulo', 'categoria', 'precio', 'experto', 'accion'];

  constructor(private recetaService: RecetaService) {}

  ngOnInit(): void {
    this.recetaService.getRecetas().subscribe({
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
}
