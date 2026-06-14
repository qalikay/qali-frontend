import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';

import { AuthService } from '../../services/auth.service';
import { LoginRequest, RegistroClienteRequest } from '../../models/auth.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatCardModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  form: FormGroup;
  mensaje = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      telefono: ['', Validators.required],
    });
  }

  registrar(): void {
    if (this.form.invalid) {
      return;
    }

    const datos: RegistroClienteRequest = this.form.value;

    this.auth.registerCliente(datos).subscribe({
      next: () => {
        const login: LoginRequest = { username: datos.username, password: datos.password };
        this.auth.login(login).subscribe({
          next: (resp) => {
            this.auth.guardarSesion(resp);
            this.snackBar.open('Cuenta creada', 'Cerrar', { duration: 3000 });
            this.router.navigate(['/home']);
          },
          error: () => {
            this.mensaje = 'Cuenta creada pero no se pudo iniciar sesion.';
          },
        });
      },
      error: () => {
        this.mensaje = 'No se pudo registrar. Verifica los datos o el backend.';
      },
    });
  }
}
