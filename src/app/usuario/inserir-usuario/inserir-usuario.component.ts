import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/shared/models/usuario.model';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-inserir-usuario',
  templateUrl: './inserir-usuario.component.html',
  styleUrls: ['./inserir-usuario.component.css']
})


export class InserirUsuarioComponent implements OnInit {

  @ViewChild('formUsuario') formUsuario!: NgForm;

  usuario!: Usuario;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.usuario = new Usuario();
  }

  inserir(): void {
    if (this.formUsuario.form.valid) {
      this.usuarioService.inserir(this.usuario);
      this.router.navigate(["/usuarios"]);
    }
  }

}
