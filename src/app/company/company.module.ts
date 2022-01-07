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

import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    CreateCompanyComponent,
    EditCompanyComponent,
    ListCompanyComponent, 
    DeleteCompanyComponent
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
