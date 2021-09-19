import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from 'src/app/shared/models/usuario.model';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.css']
})
export class EditarUsuarioComponent implements OnInit {
  @ViewChild("formUsuario") formUsuario!: NgForm;

  usuario!: Usuario;

  constructor(
    private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    let id = +this.route.snapshot.params['id'];
    const res = this.usuarioService.buscarPorId(id);
    if (res !== undefined)
      this.usuario = res;
    else
      throw new Error("Usuário não encontrado: id = " + id);

  }

  atualizar(): void {
    if (this.formUsuario.form.valid) {
      this.usuarioService.atualizar(this.usuario);
      this.router.navigate(['/usuarios']);
    }
  }

}
