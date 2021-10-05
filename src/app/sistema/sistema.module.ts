import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListarSistemaComponent } from './listar-sistema/listar-sistema.component';

import { SistemaService } from './service/sistema.service';
import { EditarSistemaComponent } from './editar-sistema/editar-sistema.component';
import { InserirSistemaComponent } from './inserir-sistema/inserir-sistema.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    ListarSistemaComponent,
    InserirSistemaComponent,
    EditarSistemaComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  providers: [
    SistemaService
  ]
})
export class SistemaModule { }
