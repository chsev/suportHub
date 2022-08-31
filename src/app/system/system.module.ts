import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateSystemComponent } from './create-system/create-system.component';
import { EditSystemComponent } from './edit-system/edit-system.component';
import { DeleteSystemComponent } from './delete-system/delete-system.component';
import { ListSystemComponent } from './list-system/list-system.component';
import { SystemService } from './services/system.service';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { FormsModule } from '@angular/forms';
import { ViewSystemComponent } from './view-system/view-system.component';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { UploadDocSystemComponent } from './view-system/uploadDoc-system/uploadDoc-system.component';
import { DocService } from './services/doc.service';
import { UploadVersionSystemComponent } from './view-system/uploadVersion-system/uploadVersion-system.component';



@NgModule({
  declarations: [
    CreateSystemComponent,
    EditSystemComponent,
    DeleteSystemComponent,
    ListSystemComponent,
    ViewSystemComponent,
    UploadDocSystemComponent,
    UploadVersionSystemComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    FlexLayoutModule,
    AngularFirestoreModule,
    FormsModule,
    AngularFireStorageModule
  ],
  providers: [SystemService, DocService]
})
export class SystemModule { }
