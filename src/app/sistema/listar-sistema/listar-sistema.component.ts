import { Component, OnInit } from '@angular/core';
import { Sistema } from 'src/app/shared/models/sistema.model';
import { SistemaService } from '../service/sistema.service';

@Component({
  selector: 'app-listar-sistema',
  templateUrl: './listar-sistema.component.html',
  styleUrls: ['./listar-sistema.component.css']
})
export class ListarSistemaComponent implements OnInit {

  sistemas: Sistema[] = [];

  constructor(
    private sistemaService: SistemaService
  ) { }

  ngOnInit(): void {
    this.sistemas =  this.listarTodos();
  }

  listarTodos(): Sistema[] {
    return this.sistemaService.listarTodos();
  }

  remover($event: any, sistema: Sistema): void {
    $event.preventDefault();
    if (confirm('Deseja realmente remover o sistema "' + sistema.nome + '"?')) {
      this.sistemaService.remover(sistema.id!);
      this.sistemas = this.listarTodos();
    }
  }

}
