import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateTeamComponent } from './create-team/create-team.component';
import { EditTeamComponent } from './edit-team/edit-team.component';
import { ListTeamComponent } from './list-team/list-team.component';
import { DeleteTeamComponent } from './delete-team/delete-team.component';
import { TeamService } from './services/team.service';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { FormsModule } from '@angular/forms';
import { BottomSheetMembersOptionsTeam, ViewTeamComponent } from './view-team/view-team.component';


@NgModule({
  declarations: [
    CreateTeamComponent,
    EditTeamComponent,
    ListTeamComponent,
    DeleteTeamComponent,
    ViewTeamComponent,
    BottomSheetMembersOptionsTeam
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    FlexLayoutModule,
    AngularFirestoreModule,
    FormsModule
  ],
  providers: [TeamService]
})
export class TeamModule { }
