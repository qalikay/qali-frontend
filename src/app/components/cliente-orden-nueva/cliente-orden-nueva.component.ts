import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CurrencyPipe } from '@angular/common';

import { AuthService } from '../../services/auth.service';
import { InsumoService } from '../../services/insumo.service';
import { RecetaService } from '../../services/receta.service';
import { OrdenService } from '../../services/orden.service';
import { CrearOrdenRequest } from '../../models/orden.model';

@Component({
  selector: 'app-cliente-orden-nueva',
  standalone: true,
  imports: [
    ReactiveFormsModule, RouterLink, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatSelectModule, MatCardModule, MatSnackBarModule, CurrencyPipe,
  ],
  templateUrl: './cliente-orden-nueva.component.html',
  styleUrl: './cliente-orden-nueva.component.css',
})
export class ClienteOrdenNuevaComponent implements OnInit {
  form: FormGroup;
  mensaje = '';
  descripcionItem = '';
  precioItem = 0;
  metodos = ['YAPE', 'PLIN', 'TARJETA', 'EFECTIVO'];

  constructor(
    private fb: FormBuilder,
    private ordenService: OrdenService,
    private insumoService: InsumoService,
    private recetaService: RecetaService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.form = this.fb.group({
      metodoPago: ['YAPE', Validators.required],
      tipoItem: ['INSUMO', Validators.required],
      itemId: [null, Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    if (!this.auth.esCliente()) {
      this.router.navigate(['/login']);
      return;
    }
    const tipo = this.route.snapshot.queryParamMap.get('tipo') || 'INSUMO';
    const itemId = this.route.snapshot.queryParamMap.get('id');
    if (itemId) {
      this.form.patchValue({ tipoItem: tipo, itemId: Number(itemId) });
      this.cargarItem();
    }
    this.form.get('tipoItem')?.valueChanges.subscribe(() => this.cargarItem());
    this.form.get('itemId')?.valueChanges.subscribe(() => this.cargarItem());
  }

  cargarItem(): void {
    const tipo = this.form.value.tipoItem;
    const id = Number(this.form.value.itemId);
    if (!id) return;
    if (tipo === 'INSUMO') {
      this.insumoService.getInsumo(id).subscribe({
        next: (i) => { this.descripcionItem = i.nombre; this.precioItem = i.precio; },
      });
    } else {
      this.recetaService.getReceta(id).subscribe({
        next: (r) => { this.descripcionItem = r.titulo; this.precioItem = r.precio; },
      });
    }
  }

  comprar(): void {
    if (this.form.invalid) return;
    const v = this.form.value;
    const datos: CrearOrdenRequest = {
      metodoPago: v.metodoPago,
      detalles: [{ tipoItem: v.tipoItem, itemId: Number(v.itemId), cantidad: Number(v.cantidad) }],
    };
    this.ordenService.crear(datos).subscribe({
      next: (o) => {
        this.snackBar.open('Orden creada', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/ordenes', o.id]);
      },
      error: () => (this.mensaje = 'No se pudo crear la orden. Verifica stock o que estes logueado como cliente.'),
    });
  }
}
