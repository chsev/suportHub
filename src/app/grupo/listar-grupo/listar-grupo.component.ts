import { Component, OnInit } from '@angular/core';
import { Grupo } from 'src/app/shared/models/grupo.model';
import { GrupoService } from '../services/grupo.service';

@Component({
  selector: 'app-listar-grupo',
  templateUrl: './listar-grupo.component.html',
  styleUrls: ['./listar-grupo.component.css']
})
export class ListarGrupoComponent implements OnInit {

  grupos: Grupo[] = [];

  constructor(private grupoService: GrupoService) { }

  ngOnInit(): void {
    this.grupos = this.listarTodos();
  }

  listarTodos(): Grupo[] {
    return this.grupoService.listarTodos();
  }

  remover($event: any, grupo: Grupo): void {
    $event.preventDefault();
    if (confirm('Deseja realmente remover o grupo "' + grupo.nome + '"?')) {
      this.grupoService.remover(grupo.id!);
      this.grupos = this.listarTodos();
    }
  }

}
