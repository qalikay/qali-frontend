import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CurrencyPipe } from '@angular/common';

import { InsumoService } from '../../services/insumo.service';

@Component({
  selector: 'app-insumos',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatButtonModule, MatProgressSpinnerModule, CurrencyPipe],
  templateUrl: './insumos.component.html',
  styleUrl: './insumos.component.css',
})
export class InsumosComponent implements OnInit {
  insumos: any[] = [];
  cargando = true;
  mensaje = '';

  constructor(private insumoService: InsumoService) {}

  ngOnInit(): void {
    this.insumoService.getInsumos().subscribe({
      next: (data) => {
        this.insumos = data;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.mensaje = 'No se pudieron cargar los insumos. ¿El backend esta corriendo en localhost:8080?';
      },
    });
  }
}
