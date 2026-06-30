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
import { ConsultaService } from '../../services/consulta.service';
import { ExpertoService } from '../../services/experto.service';
import { Experto } from '../../models/experto.model';

@Component({
  selector: 'app-cliente-consulta-nueva',
  standalone: true,
  imports: [
    ReactiveFormsModule, RouterLink, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatSelectModule, MatCardModule, MatSnackBarModule,
  ],
  templateUrl: './cliente-consulta-nueva.component.html',
  styleUrl: './cliente-consulta-nueva.component.css',
})
export class ClienteConsultaNuevaComponent implements OnInit {
  form: FormGroup;
  expertos: Experto[] = [];
  mensaje = '';

  constructor(
    private fb: FormBuilder,
    private consultaService: ConsultaService,
    private expertoService: ExpertoService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.form = this.fb.group({
      asunto: ['', Validators.required],
      expertoId: [null, Validators.required],
      mensajeInicial: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (!this.auth.esCliente()) {
      this.router.navigate(['/login']);
      return;
    }
    this.expertoService.listar().subscribe({ next: (data) => (this.expertos = data) });
    const expertoId = this.route.snapshot.queryParamMap.get('expertoId');
    if (expertoId) {
      this.form.patchValue({ expertoId: Number(expertoId) });
    }
  }

  enviar(): void {
    if (this.form.invalid) return;
    this.consultaService.crear(this.form.value).subscribe({
      next: (c) => {
        this.snackBar.open('Consulta creada', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/consultas', c.id]);
      },
      error: () => (this.mensaje = 'No se pudo crear la consulta.'),
    });
  }
}
