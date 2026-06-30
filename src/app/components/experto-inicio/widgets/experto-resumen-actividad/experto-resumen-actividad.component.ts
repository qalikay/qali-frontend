import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-experto-resumen-actividad',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './experto-resumen-actividad.component.html',
  styleUrl: './experto-resumen-actividad.component.css',
})
export class ExpertoResumenActividadComponent {}
