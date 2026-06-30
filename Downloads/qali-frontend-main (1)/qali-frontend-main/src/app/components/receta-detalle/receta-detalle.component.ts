import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CurrencyPipe, DatePipe } from '@angular/common';

import { RecetaService } from '../../services/receta.service';
import { ResenaService } from '../../services/resena.service';
import { AuthService } from '../../services/auth.service';
import { Receta } from '../../models/receta.model';
import { Resena } from '../../models/resena.model';

@Component({
  selector: 'app-receta-detalle',
  standalone: true,
  imports: [
    RouterLink, ReactiveFormsModule, MatCardModule, MatButtonModule, MatDividerModule,
    MatProgressSpinnerModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatSnackBarModule, CurrencyPipe, DatePipe,
  ],
  templateUrl: './receta-detalle.component.html',
  styleUrl: './receta-detalle.component.css',
})
export class RecetaDetalleComponent implements OnInit {
  receta: Receta | null = null;
  resenas: Resena[] = [];
  formResena: FormGroup;
  cargando = true;
  mensaje = '';

  constructor(
    private route: ActivatedRoute,
    private recetaService: RecetaService,
    private resenaService: ResenaService,
    public auth: AuthService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  ) {
    this.formResena = this.fb.group({
      calificacion: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      comentario: [''],
    });
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.recetaService.getReceta(id).subscribe({
      next: (data) => {
        this.receta = data;
        this.cargando = false;
        this.cargarResenas(id);
      },
      error: () => { this.cargando = false; this.mensaje = 'No se encontro la receta.'; },
    });
  }

  cargarResenas(id: number): void {
    this.resenaService.listarPorItem('RECETA', id).subscribe({
      next: (data) => (this.resenas = data),
    });
  }

  publicarResena(): void {
    if (!this.receta || this.formResena.invalid || !this.auth.esCliente()) return;
    this.resenaService.crear({
      ...this.formResena.value,
      tipoItem: 'RECETA',
      itemId: this.receta.id,
    }).subscribe({
      next: () => {
        this.snackBar.open('Resena publicada', 'Cerrar', { duration: 3000 });
        this.formResena.patchValue({ comentario: '' });
        this.cargarResenas(this.receta!.id);
      },
      error: () => this.snackBar.open('No se pudo publicar la resena', 'Cerrar', { duration: 3000 }),
    });
  }
}
