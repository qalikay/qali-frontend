import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-register-seleccion',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatButtonModule],
  templateUrl: './register-seleccion.component.html',
  styleUrl: './register-seleccion.component.css',
})
export class RegisterSeleccionComponent {}
