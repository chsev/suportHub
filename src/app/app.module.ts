import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UsuarioModule } from './usuario/usuario.module';
import { EquipeModule } from './equipe/equipe.module';
import { SistemaModule } from './sistema/sistema.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './home/home.component';
import { AuthModule } from './auth/auth.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationModule } from './navigation/navigation.module';

import { MaterialModule } from './material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../environments/environment';

import { CompanyModule } from './company/company.module';
import { WelcomeModule } from './welcome/welcome.module';
import { TeamModule } from './team/team.module';
import { SystemModule } from './system/system.module';
import { UserModule } from './user/user.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    
    UsuarioModule,

    EquipeModule,
    SistemaModule,

    CompanyModule,
    TeamModule,
    SystemModule,
    UserModule,

    WelcomeModule,
    NgbModule,
    AuthModule,
    BrowserAnimationsModule,
    NavigationModule,
    MaterialModule,
    FlexLayoutModule,
    AngularFireModule.initializeApp(environment.firebase),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
