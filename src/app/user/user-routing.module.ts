import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ListUserComponent } from './list-user/list-user.component';
// import { CreateUserComponent } from './create-user/create-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';



const routes: Routes = [
    { path: 'user', redirectTo: 'user/list' }, 
    { path: 'user/list', component: ListUserComponent},
    // { path: 'user/new', component: CreateUserComponent},
    { path: 'user/edit', component: EditUserComponent}
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule, 
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class UserRoutingModule { }
