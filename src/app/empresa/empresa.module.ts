import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { EmpresaService } from './services/empresa.service';
import { ListarEmpresaComponent } from './listar-empresa/listar-empresa.component';
import { InserirEmpresaComponent } from './inserir-empresa/inserir-empresa.component';
import { EditarEmpresaComponent } from './editar-empresa/editar-empresa.component';



@NgModule({
  declarations: [
    ListarEmpresaComponent,
    InserirEmpresaComponent,
    EditarEmpresaComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
  ],
  providers: [
    EmpresaService
  ]
})
export class EmpresaModule { }
