import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ListSystemComponent } from './list-system/list-system.component';
import { CreateSystemComponent } from './create-system/create-system.component';
import { EditSystemComponent } from './edit-system/edit-system.component';



const routes: Routes = [
    { path: 'system', redirectTo: 'system/list' }, 
    { path: 'system/list', component: ListSystemComponent},
    { path: 'system/new', component: CreateSystemComponent},
    { path: 'system/edit', component: EditSystemComponent}
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
