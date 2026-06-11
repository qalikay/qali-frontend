import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { RecetasComponent } from './components/recetas/recetas.component';
import { RecetaDetalleComponent } from './components/receta-detalle/receta-detalle.component';
import { InsumosComponent } from './components/insumos/insumos.component';
import { InsumoDetalleComponent } from './components/insumo-detalle/insumo-detalle.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'recetas', component: RecetasComponent },
  { path: 'recetas/:id', component: RecetaDetalleComponent },
  { path: 'insumos', component: InsumosComponent },
  { path: 'insumos/:id', component: InsumoDetalleComponent },
  { path: '**', redirectTo: '' },
];
