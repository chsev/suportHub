import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LoginService } from './services/login.service';
import { AutocadastroComponent } from './autocadastro/autocadastro.component';



@NgModule({
  declarations: [
    LoginComponent,
    AutocadastroComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  providers: [
    LoginService
  ]
})
export class AuthModule { }
