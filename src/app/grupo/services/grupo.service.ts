import { Injectable } from '@angular/core';
import { Grupo } from 'src/app/shared/models/grupo.model';

const LS_CHAVE: string = "grupos";

@Injectable({
  providedIn: 'root'
})
export class GrupoService {

  constructor() { }

  listarTodos(): Grupo[] {
    const grupos = localStorage[LS_CHAVE];
    return grupos ? JSON.parse(grupos) : [];
  }

  inserir(grupo: Grupo): void {
    const grupos = this.listarTodos();
    grupo.id =  new Date().getTime();
    grupos.push(grupo);
    localStorage[LS_CHAVE] =  JSON.stringify(grupos);
  }

  buscarPorId(id: number): Grupo | undefined{
    const grupos: Grupo[] = this.listarTodos();
    return grupos.find(grupo => grupo.id === id)
  }

  atualizar(grupo: Grupo): void {
    const grupos: Grupo[] = this.listarTodos();

    grupos.forEach(( obj,index, objs)=> {
      if (grupo.id == obj.id) {
        objs[index] = grupo;
      }
    });
    localStorage[LS_CHAVE] = JSON.stringify(grupos);
  }

  remover(id: number): void{
    let grupos: Grupo[] = this.listarTodos();
    grupos = grupos.filter(grupo => grupo.id !== id);
    localStorage[LS_CHAVE] = JSON.stringify(grupos);
  }

}
