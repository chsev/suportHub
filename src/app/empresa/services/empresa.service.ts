import { Injectable } from '@angular/core';
import { Empresa } from 'src/app/shared/models/empresa.model';

const LS_CHAVE: string = "empresas";

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  constructor() { }

  listarTodos(): Empresa[] {
    const empresas = localStorage[LS_CHAVE];
    return empresas ? JSON.parse(empresas) : [];
  }

  inserir(empresa: Empresa): void {
    const empresas = this.listarTodos();
    empresa.id =  new Date().getTime();
    empresas.push(empresa);
    localStorage[LS_CHAVE] =  JSON.stringify(empresas);
  }

  buscarPorId(id: number): Empresa | undefined{
    const empresas: Empresa[] = this.listarTodos();
    return empresas.find(empresa => empresa.id === id)
  }

  atualizar(empresa: Empresa): void {
    const empresas: Empresa[] = this.listarTodos();

    empresas.forEach(( obj,index, objs)=> {
      if (empresa.id == obj.id) {
        objs[index] = empresa;
      }
    });
    localStorage[LS_CHAVE] = JSON.stringify(empresas);
  }

  remover(id: number): void{
    let empresas: Empresa[] = this.listarTodos();
    empresas = empresas.filter(empresa => empresa.id !== id);
    localStorage[LS_CHAVE] = JSON.stringify(empresas);
  }

}
