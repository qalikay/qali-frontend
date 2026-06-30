import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';

import { AuthService } from '../../services/auth.service';
import { ResenaService } from '../../services/resena.service';
import { Resena } from '../../models/resena.model';

@Component({
  selector: 'app-cliente-resenas',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatTableModule, MatProgressSpinnerModule, MatSnackBarModule, DatePipe],
  templateUrl: './cliente-resenas.component.html',
  styleUrl: './cliente-resenas.component.css',
})
export class ClienteResenasComponent implements OnInit {
  resenas: Resena[] = [];
  cargando = true;
  mensaje = '';
  columnas = ['calificacion', 'comentario', 'tipo', 'item', 'fecha', 'accion'];

  constructor(
    private resenaService: ResenaService,
    private auth: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    if (!this.auth.esCliente()) {
      this.router.navigate(['/login']);
      return;
    }
    this.cargar();
  }

  cargar(): void {
    this.resenaService.getMisResenas().subscribe({
      next: (data) => { this.resenas = data; this.cargando = false; },
      error: () => { this.cargando = false; this.mensaje = 'No se pudieron cargar tus resenas.'; },
    });
  }

  eliminar(id: number): void {
    if (!confirm('Eliminar esta resena?')) return;
    this.resenaService.eliminar(id).subscribe({
      next: () => {
        this.snackBar.open('Resena eliminada', 'Cerrar', { duration: 3000 });
        this.cargar();
      },
      error: () => this.snackBar.open('No se pudo eliminar', 'Cerrar', { duration: 3000 }),
    });
  }
}
