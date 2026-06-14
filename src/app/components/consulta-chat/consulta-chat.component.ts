import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';

import { AuthService } from '../../services/auth.service';
import { ConsultaService } from '../../services/consulta.service';
import { Consulta } from '../../models/consulta.model';

@Component({
  selector: 'app-consulta-chat',
  standalone: true,
  imports: [
    ReactiveFormsModule, RouterLink, MatButtonModule, MatCardModule,
    MatFormFieldModule, MatInputModule, MatProgressSpinnerModule, MatSnackBarModule, DatePipe,
  ],
  templateUrl: './consulta-chat.component.html',
  styleUrl: './consulta-chat.component.css',
})
export class ConsultaChatComponent implements OnInit {
  consulta: Consulta | null = null;
  form: FormGroup;
  cargando = true;
  mensaje = '';
  consultaId = 0;

  constructor(
    private fb: FormBuilder,
    private consultaService: ConsultaService,
    public auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.form = this.fb.group({ contenido: ['', Validators.required] });
  }

  ngOnInit(): void {
    if (!this.auth.estaLogueado()) {
      this.router.navigate(['/login']);
      return;
    }
    this.consultaId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;
    this.consultaService.getConsulta(this.consultaId).subscribe({
      next: (data) => {
        this.consulta = data;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.mensaje = 'No se pudo cargar la consulta.';
      },
    });
  }

  enviarMensaje(): void {
    if (this.form.invalid || !this.consulta || this.consulta.estado === 'CERRADA') return;
    const contenido = this.form.value.contenido;
    this.consultaService.agregarMensaje(this.consultaId, contenido).subscribe({
      next: () => {
        this.form.reset();
        this.cargar();
      },
      error: () => this.snackBar.open('No se pudo enviar el mensaje', 'Cerrar', { duration: 3000 }),
    });
  }

  cerrar(): void {
    this.consultaService.cerrar(this.consultaId).subscribe({
      next: () => {
        this.snackBar.open('Consulta cerrada', 'Cerrar', { duration: 3000 });
        this.cargar();
      },
      error: () => this.snackBar.open('No se pudo cerrar', 'Cerrar', { duration: 3000 }),
    });
  }

  volverRuta(): string {
    return this.auth.esExperto() ? '/experto/consultas' : '/cliente/consultas';
  }
}
