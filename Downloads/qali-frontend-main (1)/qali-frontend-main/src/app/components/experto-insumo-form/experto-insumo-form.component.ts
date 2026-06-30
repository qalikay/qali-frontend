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
import { InsumoService } from '../../services/insumo.service';
import { Categoria } from '../../models/categoria.model';
import { CrearInsumoRequest } from '../../models/insumo.model';

@Component({
  selector: 'app-experto-insumo-form',
  standalone: true,
  imports: [
    ReactiveFormsModule, RouterLink, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatSelectModule, MatCardModule, MatSnackBarModule,
  ],
  templateUrl: './experto-insumo-form.component.html',
  styleUrl: './experto-insumo-form.component.css',
})
export class ExpertoInsumoFormComponent implements OnInit {
  form: FormGroup;
  categorias: Categoria[] = [];
  mensaje = '';
  edicion = false;
  insumoId = 0;
  tipos = ['HIERBA', 'ACEITE', 'POLVO', 'EXTRACTO', 'OTRO'];

  constructor(
    private fb: FormBuilder,
    private insumoService: InsumoService,
    private categoriaService: CategoriaService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      precio: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      unidad: [''],
      tipo: ['HIERBA', Validators.required],
      imagenUrl: [''],
      categoriaId: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    if (!this.auth.esExperto()) {
      this.router.navigate(['/login']);
      return;
    }
    this.categoriaService.listar().subscribe({ next: (data) => (this.categorias = data) });
    this.route.params.subscribe((params) => {
      const id = params['id'];
      this.edicion = id != null;
      if (this.edicion) {
        this.insumoId = Number(id);
        this.cargar();
      }
    });
  }

  cargar(): void {
    this.insumoService.getMisInsumos().subscribe({
      next: (lista) => {
        const i = lista.find((x) => x.id === this.insumoId);
        if (!i) {
          this.mensaje = 'Insumo no encontrado.';
          return;
        }
        this.form.patchValue({
          nombre: i.nombre,
          descripcion: i.descripcion,
          precio: i.precio,
          stock: i.stock,
          unidad: i.unidad,
          tipo: i.tipo,
          imagenUrl: i.imagenUrl,
          categoriaId: i.categoria?.id,
        });
      },
      error: () => (this.mensaje = 'No se pudo cargar el insumo.'),
    });
  }

  guardar(): void {
    if (this.form.invalid) return;
    const datos: CrearInsumoRequest = this.form.value;
    const op = this.edicion
      ? this.insumoService.actualizar(this.insumoId, datos)
      : this.insumoService.crear(datos);
    op.subscribe({
      next: () => {
        this.snackBar.open(this.edicion ? 'Insumo actualizado' : 'Insumo creado', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/experto/insumos']);
      },
      error: () => (this.mensaje = 'No se pudo guardar el insumo.'),
    });
  }
}
