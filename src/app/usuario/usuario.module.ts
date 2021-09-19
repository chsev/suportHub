import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'

import { UsuarioService } from './services/usuario.service';
import { ListarUsuarioComponent } from './listar-usuario/listar-usuario.component';
import { InserirUsuarioComponent } from './inserir-usuario/inserir-usuario.component';
import { EditarUsuarioComponent } from './editar-usuario/editar-usuario.component';


@NgModule({
  declarations: [
    ListarUsuarioComponent,
    InserirUsuarioComponent,
    EditarUsuarioComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  providers: [
    UsuarioService
  ]
})
export class UsuarioModule { }
