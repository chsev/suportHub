import { Component, OnInit } from '@angular/core';
import { Equipe } from 'src/app/shared/models/equipe.model';
import { EquipeService } from '../service/equipe.service';

@Component({
  selector: 'app-listar-equipe',
  templateUrl: './listar-equipe.component.html',
  styleUrls: ['./listar-equipe.component.css']
})
export class ListarEquipeComponent implements OnInit {

  equipes: Equipe[] = [];

  constructor(private equipeService: EquipeService) { }

  ngOnInit(): void {
    this.equipes = this.listarTodos();
  }

  listarTodos(): Equipe[] {
    return this.equipeService.listarTodos();
  }

  remover($event: any, equipe: Equipe): void {
    $event.preventDefault();
    if (confirm('Deseja realmente remover a equipe "' + equipe.nome + '"?')) {
      this.equipeService.remover(equipe.id!);
      this.equipes = this.listarTodos();
    }
  }

}
