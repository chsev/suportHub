import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ListAccountComponent } from './list-account/list-account.component'; 
import { AuthGuard } from '../auth/auth.guard';



const routes: Routes = [
    { path: 'account', redirectTo: 'account/view' }, 
    { path: 'account/view', component: ListAccountComponent, canActivate: [AuthGuard]},
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule, 
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
