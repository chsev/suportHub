import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditarEquipeComponent } from './equipe/editar-equipe/editar-equipe.component';
import { InserirEquipeComponent } from './equipe/inserir-equipe/inserir-equipe.component';
import { ListarEquipeComponent } from './equipe/listar-equipe/listar-equipe.component';
import { EditarEmpresaComponent } from './empresa/editar-empresa/editar-empresa.component';
import { InserirEmpresaComponent } from './empresa/inserir-empresa/inserir-empresa.component';
import { ListarEmpresaComponent } from './empresa/listar-empresa/listar-empresa.component';
import { EditarUsuarioComponent } from './usuario/editar-usuario/editar-usuario.component';
import { InserirUsuarioComponent } from './usuario/inserir-usuario/inserir-usuario.component';
import { ListarUsuarioComponent } from './usuario/listar-usuario/listar-usuario.component';

const routes: Routes = [
  { path: '', redirectTo: 'usuarios/listar', pathMatch: 'full' },
  { path: 'usuarios', redirectTo: 'usuarios/listar' }, 
  { path: 'usuarios/listar', component: ListarUsuarioComponent },
  { path: 'usuarios/novo', component: InserirUsuarioComponent },
  { path: 'usuarios/editar/:id', component: EditarUsuarioComponent },

  { path: 'empresas', redirectTo: 'empresas/listar' }, 
  { path: 'empresas/listar', component: ListarEmpresaComponent },
  { path: 'empresas/novo', component: InserirEmpresaComponent},
  { path: 'empresas/editar/:id', component: EditarEmpresaComponent},

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
