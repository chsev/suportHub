import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ListTeamComponent } from './list-team/list-team.component';
import { CreateTeamComponent } from './create-team/create-team.component';
import { EditTeamComponent } from './edit-team/edit-team.component';
import { ViewTeamComponent } from './view-team/view-team.component';
import { AuthGuard } from '../auth/auth.guard';


const routes: Routes = [
    { path: 'team', redirectTo: 'team/list' }, 
    { path: 'team/list', component: ListTeamComponent, canActivate: [AuthGuard]},
    { path: 'team/new', component: CreateTeamComponent, canActivate: [AuthGuard]},
    { path: 'team/edit', component: EditTeamComponent, canActivate: [AuthGuard]},
    { path: 'team/view', component: ViewTeamComponent, canActivate: [AuthGuard]}
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
