import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../../services/auth.service';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../models/cliente.model';

@Component({
  selector: 'app-cliente-perfil',
  standalone: true,
  imports: [
    ReactiveFormsModule, RouterLink, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatCardModule, MatSnackBarModule,
  ],
  templateUrl: './cliente-perfil.component.html',
  styleUrl: './cliente-perfil.component.css',
})
export class ClientePerfilComponent implements OnInit {
  form: FormGroup;
  mensaje = '';

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private auth: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.form = this.fb.group({
      nombres: [''],
      apellidos: [''],
      telefono: [''],
    });
  }

  ngOnInit(): void {
    if (!this.auth.esCliente()) {
      this.router.navigate(['/login']);
      return;
    }
    this.clienteService.getMiPerfil().subscribe({
      next: (c: Cliente) => this.form.patchValue(c),
      error: () => (this.mensaje = 'No se pudo cargar el perfil.'),
    });
  }

  guardar(): void {
    this.clienteService.actualizarMiPerfil(this.form.value).subscribe({
      next: () => this.snackBar.open('Perfil actualizado', 'Cerrar', { duration: 3000 }),
      error: () => (this.mensaje = 'No se pudo actualizar.'),
    });
  }
}
