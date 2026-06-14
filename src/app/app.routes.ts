import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { RegisterSeleccionComponent } from './components/register-seleccion/register-seleccion.component';
import { RegisterExpertoComponent } from './components/register-experto/register-experto.component';
import { ClienteInicioComponent } from './components/cliente-inicio/cliente-inicio.component';
import { ExpertoInicioComponent } from './components/experto-inicio/experto-inicio.component';
import { ExpertoRecetasComponent } from './components/experto-recetas/experto-recetas.component';
import { ExpertoRecetaFormComponent } from './components/experto-receta-form/experto-receta-form.component';
import { ExpertoInsumosComponent } from './components/experto-insumos/experto-insumos.component';
import { ExpertoInsumoFormComponent } from './components/experto-insumo-form/experto-insumo-form.component';
import { ExpertoConsultasComponent } from './components/experto-consultas/experto-consultas.component';
import { ExpertoPerfilComponent } from './components/experto-perfil/experto-perfil.component';
import { ClienteConsultasComponent } from './components/cliente-consultas/cliente-consultas.component';
import { ClienteConsultaNuevaComponent } from './components/cliente-consulta-nueva/cliente-consulta-nueva.component';
import { ClienteOrdenesComponent } from './components/cliente-ordenes/cliente-ordenes.component';
import { ClienteOrdenNuevaComponent } from './components/cliente-orden-nueva/cliente-orden-nueva.component';
import { ClientePerfilComponent } from './components/cliente-perfil/cliente-perfil.component';
import { ClienteResenasComponent } from './components/cliente-resenas/cliente-resenas.component';
import { ConsultaChatComponent } from './components/consulta-chat/consulta-chat.component';
import { OrdenDetalleComponent } from './components/orden-detalle/orden-detalle.component';
import { ExpertosComponent } from './components/expertos/expertos.component';
import { ExpertoDetalleComponent } from './components/experto-detalle/experto-detalle.component';
import { RecetasComponent } from './components/recetas/recetas.component';
import { RecetaDetalleComponent } from './components/receta-detalle/receta-detalle.component';
import { InsumosComponent } from './components/insumos/insumos.component';
import { InsumoDetalleComponent } from './components/insumo-detalle/insumo-detalle.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterSeleccionComponent },
  { path: 'register/cliente', component: RegisterComponent },
  { path: 'register/experto', component: RegisterExpertoComponent },
  { path: 'cliente/inicio', component: ClienteInicioComponent },
  { path: 'cliente/perfil', component: ClientePerfilComponent },
  { path: 'cliente/consultas', component: ClienteConsultasComponent },
  { path: 'cliente/consulta-nueva', component: ClienteConsultaNuevaComponent },
  { path: 'cliente/ordenes', component: ClienteOrdenesComponent },
  { path: 'cliente/orden-nueva', component: ClienteOrdenNuevaComponent },
  { path: 'cliente/resenas', component: ClienteResenasComponent },
  { path: 'experto/inicio', component: ExpertoInicioComponent },
  { path: 'experto/perfil', component: ExpertoPerfilComponent },
  { path: 'experto/recetas', component: ExpertoRecetasComponent },
  { path: 'experto/receta-nuevo', component: ExpertoRecetaFormComponent },
  { path: 'experto/receta-nuevo/:id', component: ExpertoRecetaFormComponent },
  { path: 'experto/insumos', component: ExpertoInsumosComponent },
  { path: 'experto/insumo-nuevo', component: ExpertoInsumoFormComponent },
  { path: 'experto/insumo-nuevo/:id', component: ExpertoInsumoFormComponent },
  { path: 'experto/consultas', component: ExpertoConsultasComponent },
  { path: 'consultas/:id', component: ConsultaChatComponent },
  { path: 'ordenes/:id', component: OrdenDetalleComponent },
  { path: 'expertos', component: ExpertosComponent },
  { path: 'expertos/:id', component: ExpertoDetalleComponent },
  { path: 'recetas', component: RecetasComponent },
  { path: 'recetas/:id', component: RecetaDetalleComponent },
  { path: 'insumos', component: InsumosComponent },
  { path: 'insumos/:id', component: InsumoDetalleComponent },
  { path: '**', redirectTo: '' },
];
