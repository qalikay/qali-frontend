import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CurrencyPipe, DatePipe } from '@angular/common';

import { InsumoService } from '../../services/insumo.service';
import { ResenaService } from '../../services/resena.service';
import { AuthService } from '../../services/auth.service';
import { Insumo } from '../../models/insumo.model';
import { Resena } from '../../models/resena.model';

@Component({
  selector: 'app-insumo-detalle',
  standalone: true,
  imports: [
    RouterLink, ReactiveFormsModule, MatCardModule, MatButtonModule, MatDividerModule,
    MatProgressSpinnerModule, MatFormFieldModule, MatInputModule, MatSnackBarModule,
    CurrencyPipe, DatePipe,
  ],
  templateUrl: './insumo-detalle.component.html',
  styleUrl: './insumo-detalle.component.css',
})
export class InsumoDetalleComponent implements OnInit {
  insumo: Insumo | null = null;
  resenas: Resena[] = [];
  formResena: FormGroup;
  cargando = true;
  mensaje = '';

  constructor(
    private route: ActivatedRoute,
    private insumoService: InsumoService,
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
    this.insumoService.getInsumo(id).subscribe({
      next: (data) => {
        this.insumo = data;
        this.cargando = false;
        this.cargarResenas(id);
      },
      error: () => { this.cargando = false; this.mensaje = 'No se encontro el insumo.'; },
    });
  }

  cargarResenas(id: number): void {
    this.resenaService.listarPorItem('INSUMO', id).subscribe({
      next: (data) => (this.resenas = data),
    });
  }

  publicarResena(): void {
    if (!this.insumo || this.formResena.invalid || !this.auth.esCliente()) return;
    this.resenaService.crear({
      ...this.formResena.value,
      tipoItem: 'INSUMO',
      itemId: this.insumo.id,
    }).subscribe({
      next: () => {
        this.snackBar.open('Resena publicada', 'Cerrar', { duration: 3000 });
        this.formResena.patchValue({ comentario: '' });
        this.cargarResenas(this.insumo!.id);
      },
      error: () => this.snackBar.open('No se pudo publicar la resena', 'Cerrar', { duration: 3000 }),
    });
  }
}
