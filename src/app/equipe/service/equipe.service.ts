import { Injectable } from '@angular/core';
import { Equipe } from 'src/app/shared/models/equipe.model';

const LS_CHAVE: string = "equipes";

@Injectable({
  providedIn: 'root'
})
export class EquipeService {

  constructor() { }

  listarTodos(): Equipe[] {
    const equipes = localStorage[LS_CHAVE];
    return equipes ? JSON.parse(equipes) : [];
  }

  inserir(equipe: Equipe): void {
    const equipes = this.listarTodos();
    equipe.id =  new Date().getTime();
    equipes.push(equipe);
    localStorage[LS_CHAVE] =  JSON.stringify(equipes);
  }

  buscarPorId(id: number): Equipe | undefined{
    const equipes: Equipe[] = this.listarTodos();
    return equipes.find(equipe => equipe.id === id)
  }

  atualizar(equipe: Equipe): void {
    const equipes: Equipe[] = this.listarTodos();

    equipes.forEach(( obj,index, objs)=> {
      if (equipe.id == obj.id) {
        objs[index] = equipe;
      }
    });
    localStorage[LS_CHAVE] = JSON.stringify(equipes);
  }

  remover(id: number): void{
    let equipes: Equipe[] = this.listarTodos();
    equipes = equipes.filter(equipe => equipe.id !== id);
    localStorage[LS_CHAVE] = JSON.stringify(equipes);
  }
}
