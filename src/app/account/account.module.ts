import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListAccountComponent } from './list-account/list-account.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { FormsModule } from '@angular/forms';
import { AccountService } from './services/account.service';
import { ConfirmResetComponent } from './list-account/confirm-reset/confirm-reset.component';
import { EditPositionComponent } from './list-account/edit-position/edit-position.component';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';


@NgModule({
    declarations: [
        ListAccountComponent,
        ConfirmResetComponent,
        EditPositionComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        MaterialModule,
        FlexLayoutModule,
        AngularFirestoreModule,
        FormsModule,
        AngularFireAuthModule,
    ],
    providers: [AccountService]
})
export class AccountModule { }
