import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/shared/models/usuario.model';
import { UsuarioService } from 'src/app/usuario/services/usuario.service';

@Component({
  selector: 'app-autocadastro',
  templateUrl: './autocadastro.component.html',
  styleUrls: ['./autocadastro.component.css']
})
export class AutocadastroComponent implements OnInit {

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
      this.router.navigate(["/login"]);
    }
  }

}
