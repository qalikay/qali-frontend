import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CurrencyPipe } from '@angular/common';

import { RecetaService } from '../../services/receta.service';

@Component({
  selector: 'app-recetas',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatButtonModule, MatProgressSpinnerModule, CurrencyPipe],
  templateUrl: './recetas.component.html',
  styleUrl: './recetas.component.css',
})
export class RecetasComponent implements OnInit {
  recetas: any[] = [];
  cargando = true;
  mensaje = '';

  constructor(private recetaService: RecetaService) {}

  ngOnInit(): void {
    this.recetaService.getRecetas().subscribe({
      next: (data) => {
        this.recetas = data;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.mensaje = 'No se pudieron cargar las recetas. ¿El backend esta corriendo en localhost:8080?';
      },
    });
  }
}
