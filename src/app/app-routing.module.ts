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
import { ListarSistemaComponent } from './sistema/listar-sistema/listar-sistema.component';
import { EditarSistemaComponent } from './sistema/editar-sistema/editar-sistema.component';
import { InserirSistemaComponent } from './sistema/inserir-sistema/inserir-sistema.component';
import { LoginRoutes } from './auth/auth-routing.module';
import { AuthGuard } from './auth/auth.guard';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'usuarios', redirectTo: 'usuarios/listar' }, 
  { path: 'usuarios/listar', component: ListarUsuarioComponent, canActivate: [AuthGuard], data: {role: 'ADMIN,GERENTE'} },
  { path: 'usuarios/novo', component: InserirUsuarioComponent, canActivate: [AuthGuard], data: {role: 'ADMIN,GERENTE'} },
  { path: 'usuarios/editar/:id', component: EditarUsuarioComponent, canActivate: [AuthGuard], data: {role: 'ADMIN,GERENTE'} },

  { path: 'empresas', redirectTo: 'empresas/listar' }, 
  { path: 'empresas/listar', component: ListarEmpresaComponent, canActivate: [AuthGuard], data: {role: 'ADMIN'} },
  { path: 'empresas/novo', component: InserirEmpresaComponent, canActivate: [AuthGuard], data: {role: 'ADMIN'}},
  { path: 'empresas/editar/:id', component: EditarEmpresaComponent, canActivate: [AuthGuard], data: {role: 'ADMIN'}},

  { path: 'equipes', redirectTo: 'equipes/listar' }, 
  { path: 'equipes/listar', component: ListarEquipeComponent, canActivate: [AuthGuard], data: {role: 'ADMIN,GERENTE,FUNC'} },
  { path: 'equipes/novo', component: InserirEquipeComponent, canActivate: [AuthGuard], data: {role: 'ADMIN,GERENTE,FUNC'}},
  { path: 'equipes/editar/:id', component: EditarEquipeComponent, canActivate: [AuthGuard], data: {role: 'ADMIN,GERENTE,FUNC'}},

  { path: 'sistemas', redirectTo: 'sistemas/listar' }, 
  { path: 'sistemas/listar', component: ListarSistemaComponent, canActivate: [AuthGuard], data: {role: 'ADMIN,GERENTE,FUNC'}},
  { path: 'sistemas/novo', component: InserirSistemaComponent, canActivate: [AuthGuard], data: {role: 'ADMIN,GERENTE,FUNC'}},
  { path: 'sistemas/editar/:id', component: EditarSistemaComponent, canActivate: [AuthGuard], data: {role: 'ADMIN,GERENTE,FUNC'}},
  
  ...LoginRoutes,

  { path: 'home', component: HomeComponent, canActivate: [AuthGuard], data: {role: 'ADMIN,GERENTE,FUNC'}}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
