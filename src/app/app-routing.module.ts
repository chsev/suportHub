import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { EditarUsuarioComponent } from './usuario/editar-usuario/editar-usuario.component';
import { InserirUsuarioComponent } from './usuario/inserir-usuario/inserir-usuario.component';
import { ListarUsuarioComponent } from './usuario/listar-usuario/listar-usuario.component';


import { AuthGuard } from './auth/auth.guard';
import { HomeComponent } from './home/home.component';
import { AuthRoutingModule } from './auth/auth-routing.module';
import { WelcomeComponent } from './welcome/welcome/welcome.component';

import { CompanyRoutingModule } from './company/company-routing.module';
import { TeamRoutingModule } from './team/team-routing.module';
import { SystemRoutingModule } from './system/system-routing.module';
import { UserRoutingModule } from './user/user-routing.module';

const routes: Routes = [
  
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },

  { path: 'welcome', component: WelcomeComponent  },

  // { path: 'usuarios', redirectTo: 'usuarios/listar' }, 
  // { path: 'usuarios/listar', component: ListarUsuarioComponent, canActivate: [AuthGuard], data: {role: 'ADMIN,GERENTE'} },
  // { path: 'usuarios/novo', component: InserirUsuarioComponent, canActivate: [AuthGuard], data: {role: 'ADMIN,GERENTE'} },
  // { path: 'usuarios/editar/:id', component: EditarUsuarioComponent, canActivate: [AuthGuard], data: {role: 'ADMIN,GERENTE'} },

  // { path: 'empresas', redirectTo: 'empresas/listar' }, 
  // { path: 'empresas/listar', component: ListCompanyComponent, canActivate: [AuthGuard], data: {role: 'ADMIN'} },
  // { path: 'empresas/novo', component: InserirEmpresaComponent, canActivate: [AuthGuard], data: {role: 'ADMIN'}},
  // { path: 'empresas/editar/:id', component: EditarEmpresaComponent, canActivate: [AuthGuard], data: {role: 'ADMIN'}},

  // { path: 'equipes', redirectTo: 'equipes/listar' }, 
  // { path: 'equipes/listar', component: CreateCompanyComponent, canActivate: [AuthGuard], data: {role: 'ADMIN,GERENTE,FUNC'} },
  // { path: 'equipes/novo', component: InserirEquipeComponent, canActivate: [AuthGuard], data: {role: 'ADMIN,GERENTE,FUNC'}},
  // { path: 'equipes/editar/:id', component: EditarEquipeComponent, canActivate: [AuthGuard], data: {role: 'ADMIN,GERENTE,FUNC'}},

  // { path: 'sistemas', redirectTo: 'sistemas/listar' }, 
  // { path: 'sistemas/listar', component: ListarSistemaComponent, canActivate: [AuthGuard], data: {role: 'ADMIN,GERENTE,FUNC'}},
  // { path: 'sistemas/novo', component: InserirSistemaComponent, canActivate: [AuthGuard], data: {role: 'ADMIN,GERENTE,FUNC'}},
  // { path: 'sistemas/editar/:id', component: EditarSistemaComponent, canActivate: [AuthGuard], data: {role: 'ADMIN,GERENTE,FUNC'}},

  { path: 'home', component: HomeComponent, canActivate: [AuthGuard], data: {role: 'ADMIN,GERENTE,FUNC'}}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    AuthRoutingModule,
    CompanyRoutingModule,
    TeamRoutingModule,
    SystemRoutingModule,
    UserRoutingModule
  ],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
