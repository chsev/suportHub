import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ListCompanyComponent } from './list-company/list-company.component';
import { CreateCompanyComponent } from './create-company/create-company.component';
import { EditCompanyComponent } from './edit-company/edit-company.component';
import { WelcomeCompanyComponent } from './welcome-company/welcome-company.component';


const routes: Routes = [
    { path: 'company', redirectTo: 'company/welcome' }, 
    { path: 'company/list', component: ListCompanyComponent},
    { path: 'company/new', component: CreateCompanyComponent},
    { path: 'company/edit', component: EditCompanyComponent},
    { path: 'company/welcome', component: WelcomeCompanyComponent},
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
