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
import { ListallCompanyComponent } from './listall-company/listall-company.component';
import { JoinOpenCompanyComponent } from './list-company/joinOpen-company/joinOpen-company.component';
import { JoinClosedCompanyComponent } from './list-company/joinClosed-company/joinClosed-company.component';
import { BottomSheetOverviewMembersOptions, ViewCompanyComponent } from './view-company/view-company.component';

@NgModule({
  declarations: [
    CreateCompanyComponent,
    EditCompanyComponent,
    ListCompanyComponent, 
    DeleteCompanyComponent, 
    WelcomeCompanyComponent, 
    ListallCompanyComponent,
    JoinOpenCompanyComponent,
    JoinClosedCompanyComponent,
    ViewCompanyComponent,
    BottomSheetOverviewMembersOptions
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
