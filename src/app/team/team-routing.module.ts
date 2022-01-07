import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ListTeamComponent } from './list-team/list-team.component';
import { CreateTeamComponent } from './create-team/create-team.component';
import { EditTeamComponent } from './edit-team/edit-team.component';



const routes: Routes = [
    { path: 'team', redirectTo: 'team/list' }, 
    { path: 'team/list', component: ListTeamComponent},
    { path: 'team/new', component: CreateTeamComponent},
    { path: 'team/edit', component: EditTeamComponent}
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule, 
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TeamRoutingModule { }
