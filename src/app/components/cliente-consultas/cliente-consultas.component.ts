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
  selector: 'app-cliente-consultas',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatTableModule, MatProgressSpinnerModule, DatePipe],
  templateUrl: './cliente-consultas.component.html',
  styleUrl: './cliente-consultas.component.css',
})
export class ClienteConsultasComponent implements OnInit {
  consultas: Consulta[] = [];
  cargando = true;
  mensaje = '';
  columnas = ['asunto', 'experto', 'estado', 'fecha', 'accion'];

  constructor(
    private consultaService: ConsultaService,
    private auth: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    if (!this.auth.esCliente()) {
      this.router.navigate(['/login']);
      return;
    }
    this.consultaService.getMisConsultasCliente().subscribe({
      next: (data) => { this.consultas = data; this.cargando = false; },
      error: () => { this.cargando = false; this.mensaje = 'No se pudieron cargar tus consultas.'; },
    });
  }
}
