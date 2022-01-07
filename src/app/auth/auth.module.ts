import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LoginService } from './services/login.service';
import { SignupComponent } from './signup/signup.component';
import { MaterialModule } from '../material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AutocadastroComponent } from './autocadastro/autocadastro.component';


@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    AutocadastroComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule, //?
    AngularFireAuthModule,
    AngularFirestoreModule
  ],
  providers: [
    LoginService
  ]
})
export class AuthModule { }
