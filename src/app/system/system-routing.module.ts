import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ListSystemComponent } from './list-system/list-system.component';
import { CreateSystemComponent } from './create-system/create-system.component';
import { EditSystemComponent } from './edit-system/edit-system.component';
import { ViewSystemComponent } from './view-system/view-system.component';
import { AuthGuard } from '../auth/auth.guard';



const routes: Routes = [
    { path: 'system', redirectTo: 'system/list' }, 
    { path: 'system/list', component: ListSystemComponent, canActivate: [AuthGuard]},
    { path: 'system/new', component: CreateSystemComponent, canActivate: [AuthGuard]},
    { path: 'system/edit', component: EditSystemComponent, canActivate: [AuthGuard]},
    { path: 'system/view', component: ViewSystemComponent, canActivate: [AuthGuard]},
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule, 
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class SystemRoutingModule { }
