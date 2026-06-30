import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-cliente-accesos-destacados',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './cliente-accesos-destacados.component.html',
  styleUrl: './cliente-accesos-destacados.component.css',
})
export class ClienteAccesosDestacadosComponent {}
