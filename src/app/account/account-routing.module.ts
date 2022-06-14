import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ListAccountComponent } from './list-account/list-account.component'; 



const routes: Routes = [
    { path: 'account', redirectTo: 'account/list' }, 
    { path: 'account/list', component: ListAccountComponent},
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
