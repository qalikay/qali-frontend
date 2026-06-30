import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ExpertoService } from '../../services/experto.service';
import { AuthService } from '../../services/auth.service';
import { Experto } from '../../models/experto.model';

@Component({
  selector: 'app-experto-detalle',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatCardModule, MatProgressSpinnerModule],
  templateUrl: './experto-detalle.component.html',
  styleUrl: './experto-detalle.component.css',
})
export class ExpertoDetalleComponent implements OnInit {
  experto: Experto | null = null;
  cargando = true;
  mensaje = '';

  constructor(
    private route: ActivatedRoute,
    private expertoService: ExpertoService,
    public auth: AuthService,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.expertoService.getExperto(id).subscribe({
      next: (data) => { this.experto = data; this.cargando = false; },
      error: () => { this.cargando = false; this.mensaje = 'No se encontro el experto.'; },
    });
  }
}
