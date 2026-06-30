import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DatePipe } from '@angular/common';

import { AuthService } from '../../services/auth.service';
import { ConsultaService } from '../../services/consulta.service';
import { Consulta } from '../../models/consulta.model';

@Component({
  selector: 'app-experto-consultas',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatTableModule, MatProgressSpinnerModule, DatePipe],
  templateUrl: './experto-consultas.component.html',
  styleUrl: './experto-consultas.component.css',
})
export class ExpertoConsultasComponent implements OnInit {
  consultas: Consulta[] = [];
  cargando = true;
  mensaje = '';
  columnas = ['asunto', 'cliente', 'estado', 'fecha', 'accion'];

  constructor(
    private consultaService: ConsultaService,
    private auth: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    if (!this.auth.esExperto()) {
      this.router.navigate(['/login']);
      return;
    }
    this.consultaService.getMisConsultasExperto().subscribe({
      next: (data) => { this.consultas = data; this.cargando = false; },
      error: () => { this.cargando = false; this.mensaje = 'No se pudieron cargar las consultas.'; },
    });
  }
}
