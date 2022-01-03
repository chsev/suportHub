import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UsuarioModule } from './usuario/usuario.module';
import { EquipeModule } from './equipe/equipe.module';
import { EmpresaModule } from './empresa/empresa.module';
import { SistemaModule } from './sistema/sistema.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './home/home.component';
import { AuthModule } from './auth/auth.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    UsuarioModule,
    EmpresaModule,
    EquipeModule,
    SistemaModule,
    NgbModule,
    AuthModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
