import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateTeamComponent } from './create-team/create-team.component';
import { EditTeamComponent } from './edit-team/edit-team.component';
import { ListTeamComponent } from './list-team/list-team.component';
import { TeamService } from './services/team.service';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { FormsModule } from '@angular/forms';
import { ViewTeamComponent } from './view-team/view-team.component';
import { BottomSheetTeamComponent } from './view-team/bottom-sheet-team/bottom-sheet-team.component';
import { ConfirmExclusionTeamComponent } from './view-team/confirm-exclusion-team/confirm-exclusion-team.component';


@NgModule({
  declarations: [
    CreateTeamComponent,
    EditTeamComponent,
    ListTeamComponent,
    ViewTeamComponent,
    BottomSheetTeamComponent,
    ConfirmExclusionTeamComponent
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
