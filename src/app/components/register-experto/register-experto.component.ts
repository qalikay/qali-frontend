import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';

import { AuthService } from '../../services/auth.service';
import { EspecialidadService } from '../../services/especialidad.service';
import { LoginRequest, RegistroExpertoRequest } from '../../models/auth.model';
import { Especialidad } from '../../models/especialidad.model';

@Component({
  selector: 'app-register-experto',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatCardModule,
    MatSelectModule,
  ],
  templateUrl: './register-experto.component.html',
  styleUrl: './register-experto.component.css',
})
export class RegisterExpertoComponent implements OnInit {
  form: FormGroup;
  mensaje = '';
  especialidades: Especialidad[] = [];

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private especialidadService: EspecialidadService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      telefono: ['', Validators.required],
      especialidadId: [null, Validators.required],
      trayectoria: ['', Validators.required],
      anosExperiencia: [1, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    this.especialidadService.listar().subscribe({
      next: (data) => {
        this.especialidades = data;
      },
      error: () => {
        this.mensaje = 'No se pudieron cargar las especialidades. Verifica el backend.';
      },
    });
  }

  registrar(): void {
    if (this.form.invalid) {
      return;
    }

    const datos: RegistroExpertoRequest = this.form.value;

    this.auth.registerExperto(datos).subscribe({
      next: () => {
        const login: LoginRequest = { username: datos.username, password: datos.password };
        this.auth.login(login).subscribe({
          next: (resp) => {
            this.auth.guardarSesion(resp);
            this.snackBar.open('Cuenta de experto creada', 'Cerrar', { duration: 3000 });
            this.router.navigate([this.auth.getRutaInicio()]);
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
