import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { GrupoService } from './services/grupo.service';
import { ListarGrupoComponent } from './listar-grupo/listar-grupo.component';
import { InserirGrupoComponent } from './inserir-grupo/inserir-grupo.component';
import { EditarGrupoComponent } from './editar-grupo/editar-grupo.component';


@NgModule({
  declarations: [
    ListarGrupoComponent,
    InserirGrupoComponent,
    EditarGrupoComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  providers: [
    GrupoService
  ]
})
export class GrupoModule { }
