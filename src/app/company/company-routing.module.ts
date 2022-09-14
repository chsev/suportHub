import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ListCompanyComponent } from './list-company/list-company.component';
import { CreateCompanyComponent } from './create-company/create-company.component';
import { EditCompanyComponent } from './edit-company/edit-company.component';
import { WelcomeCompanyComponent } from './welcome-company/welcome-company.component';
// import { ListallCompanyComponent } from './listall-company/listall-company.component';
import { ViewCompanyComponent } from './view-company/view-company.component';
import { AuthGuard } from '../auth/auth.guard';


const routes: Routes = [
    { path: 'company', redirectTo: 'company/welcome' }, 
    { path: 'company/list', component: ListCompanyComponent, canActivate: [AuthGuard]},
    { path: 'company/new', component: CreateCompanyComponent, canActivate: [AuthGuard]},
    { path: 'company/edit', component: EditCompanyComponent, canActivate: [AuthGuard]},
    { path: 'company/welcome', component: WelcomeCompanyComponent, canActivate: [AuthGuard]},
    // { path: 'company/listall', component: ListallCompanyComponent, canActivate: [AuthGuard]},
    { path: 'company/view', component: ViewCompanyComponent, canActivate: [AuthGuard]},
]


@NgModule({
  declarations: [],
  imports: [
    CommonModule, 
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class CompanyRoutingModule { }
