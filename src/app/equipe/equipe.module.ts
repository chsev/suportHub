import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListarEquipeComponent } from './listar-equipe/listar-equipe.component';
import { InserirEquipeComponent } from './inserir-equipe/inserir-equipe.component';
import { EditarEquipeComponent } from './editar-equipe/editar-equipe.component';
import { EquipeService } from './service/equipe.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ListarEquipeComponent,
    InserirEquipeComponent,
    EditarEquipeComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  providers: [
    EquipeService
  ]
})
export class EquipeModule { }
