import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditarUsuarioComponent } from './usuario/editar-usuario/editar-usuario.component';
import { InserirUsuarioComponent } from './usuario/inserir-usuario/inserir-usuario.component';
import { ListarUsuarioComponent } from './usuario/listar-usuario/listar-usuario.component';

const routes: Routes = [
  { path: '', redirectTo: 'usuarios/listar', pathMatch: 'full' },
  { path: 'usuarios', redirectTo: 'usuarios/listar' }, 
  { path: 'usuarios/listar', component: ListarUsuarioComponent },
  { path: 'usuarios/novo', component: InserirUsuarioComponent },
  { path: 'usuarios/editar/:id', component: EditarUsuarioComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
