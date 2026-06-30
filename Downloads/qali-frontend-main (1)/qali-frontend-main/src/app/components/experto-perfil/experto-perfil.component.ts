import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../../services/auth.service';
import { ExpertoService } from '../../services/experto.service';
import { Experto } from '../../models/experto.model';

@Component({
  selector: 'app-experto-perfil',
  standalone: true,
  imports: [
    ReactiveFormsModule, RouterLink, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatCardModule, MatSnackBarModule,
  ],
  templateUrl: './experto-perfil.component.html',
  styleUrl: './experto-perfil.component.css',
})
export class ExpertoPerfilComponent implements OnInit {
  form: FormGroup;
  mensaje = '';

  constructor(
    private fb: FormBuilder,
    private expertoService: ExpertoService,
    private auth: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.form = this.fb.group({
      nombres: [''],
      apellidos: [''],
      telefono: [''],
      trayectoria: [''],
      anosExperiencia: [0],
    });
  }

  ngOnInit(): void {
    if (!this.auth.esExperto()) {
      this.router.navigate(['/login']);
      return;
    }
    this.expertoService.getMiPerfil().subscribe({
      next: (e: Experto) => this.form.patchValue(e),
      error: () => (this.mensaje = 'No se pudo cargar el perfil.'),
    });
  }

  guardar(): void {
    this.expertoService.actualizarMiPerfil(this.form.value).subscribe({
      next: () => this.snackBar.open('Perfil actualizado', 'Cerrar', { duration: 3000 }),
      error: () => (this.mensaje = 'No se pudo actualizar.'),
    });
  }
}
