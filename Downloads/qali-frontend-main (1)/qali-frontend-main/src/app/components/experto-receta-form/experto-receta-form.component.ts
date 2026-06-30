import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../../services/auth.service';
import { CategoriaService } from '../../services/categoria.service';
import { RecetaService } from '../../services/receta.service';
import { Categoria } from '../../models/categoria.model';
import { CrearRecetaRequest } from '../../models/receta.model';

@Component({
  selector: 'app-experto-receta-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatSnackBarModule,
  ],
  templateUrl: './experto-receta-form.component.html',
  styleUrl: './experto-receta-form.component.css',
})
export class ExpertoRecetaFormComponent implements OnInit {
  form: FormGroup;
  categorias: Categoria[] = [];
  mensaje = '';
  edicion = false;
  recetaId = 0;

  constructor(
    private fb: FormBuilder,
    private recetaService: RecetaService,
    private categoriaService: CategoriaService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.form = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: [''],
      ingredientes: ['', Validators.required],
      preparacion: ['', Validators.required],
      advertencias: [''],
      minutosPreparacion: [10, [Validators.required, Validators.min(1)]],
      precio: [0, [Validators.required, Validators.min(0)]],
      imagenUrl: [''],
      categoriaId: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    if (!this.auth.esExperto()) {
      this.router.navigate(['/login']);
      return;
    }

    this.categoriaService.listar().subscribe({
      next: (data) => {
        this.categorias = data;
      },
    });

    this.route.params.subscribe((params) => {
      const id = params['id'];
      this.edicion = id != null;
      if (this.edicion) {
        this.recetaId = Number(id);
        this.cargarReceta();
      }
    });
  }

  cargarReceta(): void {
    this.recetaService.getMiReceta(this.recetaId).subscribe({
      next: (r) => {
        this.form.patchValue({
          titulo: r.titulo,
          descripcion: r.descripcion,
          ingredientes: r.ingredientes,
          preparacion: r.preparacion,
          advertencias: r.advertencias,
          minutosPreparacion: r.minutosPreparacion,
          precio: r.precio,
          imagenUrl: r.imagenUrl,
          categoriaId: r.categoria?.id,
        });
      },
      error: () => {
        this.mensaje = 'No se pudo cargar la receta.';
      },
    });
  }

  guardar(): void {
    if (this.form.invalid) {
      return;
    }

    const datos: CrearRecetaRequest = this.form.value;

    if (!this.edicion) {
      this.recetaService.crear(datos).subscribe({
        next: () => {
          this.snackBar.open('Receta creada en borrador', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/experto/recetas']);
        },
        error: () => {
          this.mensaje = 'No se pudo crear la receta.';
        },
      });
    } else {
      this.recetaService.actualizar(this.recetaId, datos).subscribe({
        next: () => {
          this.snackBar.open('Receta actualizada', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/experto/recetas']);
        },
        error: () => {
          this.mensaje = 'No se pudo actualizar la receta.';
        },
      });
    }
  }
}
