import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditarEquipeComponent } from './equipe/editar-equipe/editar-equipe.component';
import { InserirEquipeComponent } from './equipe/inserir-equipe/inserir-equipe.component';
import { ListarEquipeComponent } from './equipe/listar-equipe/listar-equipe.component';
import { EditarGrupoComponent } from './grupo/editar-grupo/editar-grupo.component';
import { InserirGrupoComponent } from './grupo/inserir-grupo/inserir-grupo.component';
import { ListarGrupoComponent } from './grupo/listar-grupo/listar-grupo.component';
import { EditarUsuarioComponent } from './usuario/editar-usuario/editar-usuario.component';
import { InserirUsuarioComponent } from './usuario/inserir-usuario/inserir-usuario.component';
import { ListarUsuarioComponent } from './usuario/listar-usuario/listar-usuario.component';

const routes: Routes = [
  { path: '', redirectTo: 'usuarios/listar', pathMatch: 'full' },
  { path: 'usuarios', redirectTo: 'usuarios/listar' }, 
  { path: 'usuarios/listar', component: ListarUsuarioComponent },
  { path: 'usuarios/novo', component: InserirUsuarioComponent },
  { path: 'usuarios/editar/:id', component: EditarUsuarioComponent },

  { path: 'grupos', redirectTo: 'grupos/listar' }, 
  { path: 'grupos/listar', component: ListarGrupoComponent },
  { path: 'grupos/novo', component: InserirGrupoComponent},
  { path: 'grupos/editar/:id', component: EditarGrupoComponent},

  { path: 'equipes', redirectTo: 'equipes/listar' }, 
  { path: 'equipes/listar', component: ListarEquipeComponent },
  { path: 'equipes/novo', component: InserirEquipeComponent},
  { path: 'equipes/editar/:id', component: EditarEquipeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
