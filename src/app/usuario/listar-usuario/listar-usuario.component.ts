import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/shared/models/usuario.model';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-listar-usuario',
  templateUrl: './listar-usuario.component.html',
  styleUrls: ['./listar-usuario.component.css']
})
export class ListarUsuarioComponent implements OnInit {

  usuarios: Usuario[] = [];

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.usuarios = this.listarTodos();
  }

  listarTodos(): Usuario[] {
    return this.usuarioService.listarTodos();
  }

  remover($event: any, usuario: Usuario): void {
    $event.preventDefault();
    if (confirm('Deseja realmente remover o usuario "' + usuario.nome + '"?')) {
      this.usuarioService.remover(usuario.id!);
      this.usuarios = this.listarTodos();
    }
  }
}
