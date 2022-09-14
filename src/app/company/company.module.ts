import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateCompanyComponent } from './create-company/create-company.component';
import { EditCompanyComponent } from './edit-company/edit-company.component';
import { ListCompanyComponent } from './list-company/list-company.component';
import { DeleteCompanyComponent } from './delete-company/delete-company.component';

import { MaterialModule } from '../material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { CompanyService } from './services/company.service';
import { RouterModule } from '@angular/router';
import { WelcomeCompanyComponent } from './welcome-company/welcome-company.component';

import { FormsModule } from '@angular/forms';
// import { ListallCompanyComponent } from './listall-company/listall-company.component';
import { JoinOpenCompanyComponent } from './list-company/joinOpen-company/joinOpen-company.component';
import { JoinClosedCompanyComponent } from './list-company/joinClosed-company/joinClosed-company.component';
import { ViewCompanyComponent } from './view-company/view-company.component';
import { JoinClosedTeamComponent } from './view-company/joinClosed-team/joinClosed-team.component';
import { JoinOpenTeamComponent } from './view-company/joinOpen-team/joinOpen-team.component';
import { BottomSheetOverviewMembersOptions } from './view-company/bottom-sheet-members-options/bottom-sheet-members-options';
import { ConfirmExclusionCompanyComponent } from './view-company/confirm-exclusion-company/confirm-exclusion-company.component';

@NgModule({
  declarations: [
    CreateCompanyComponent,
    EditCompanyComponent,
    ListCompanyComponent, 
    DeleteCompanyComponent, 
    WelcomeCompanyComponent, 
    // ListallCompanyComponent,
    JoinOpenCompanyComponent,
    JoinClosedCompanyComponent,
    ViewCompanyComponent,
    BottomSheetOverviewMembersOptions,
    JoinClosedTeamComponent,
    JoinOpenTeamComponent,
    ConfirmExclusionCompanyComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    FlexLayoutModule,
    AngularFirestoreModule,
    FormsModule
  ],
  providers: [CompanyService],
})
export class CompanyModule { }
