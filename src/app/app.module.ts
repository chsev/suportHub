import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UsuarioModule } from './usuario/usuario.module';
import { EquipeModule } from './equipe/equipe.module';
import { EmpresaModule } from './empresa/empresa.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    UsuarioModule,
    EmpresaModule,
    EquipeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
