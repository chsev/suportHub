import { Injectable } from '@angular/core';
import { Sistema } from 'src/app/shared/models/sistema.model';

const LS_CHAVE: string = "sistemas";

@Injectable({
  providedIn: 'root'
})
export class SistemaService {

  constructor() { }

  listarTodos(): Sistema[] {
    const sistemas = localStorage[LS_CHAVE];
    return sistemas ? JSON.parse(sistemas) : [];
  }


  inserir(sistema: Sistema): void {
    const sistemas = this.listarTodos();
    sistema.id =  new Date().getTime();
    sistemas.push(sistema);
    localStorage[LS_CHAVE] =  JSON.stringify(sistemas);
  }


  buscarPorId(id: number): Sistema | undefined {
    const sistemas: Sistema[] = this.listarTodos();
    return sistemas.find(sistema => sistema.id === id)
  }


  atualizar(sistema: Sistema): void {
    const sistemas: Sistema[] = this.listarTodos();

    sistemas.forEach(( obj,index, objs)=> {
      if (sistema.id == obj.id) {
        objs[index] = sistema;
      }
    });
    localStorage[LS_CHAVE] = JSON.stringify(sistemas);
  }


  remover(id: number): void{
    let sistemas: Sistema[] = this.listarTodos();
    sistemas = sistemas.filter(sistema => sistema.id !== id);
    localStorage[LS_CHAVE] = JSON.stringify(sistemas);
  }
  
}
