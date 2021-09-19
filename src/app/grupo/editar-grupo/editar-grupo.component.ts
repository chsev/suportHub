import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Grupo } from 'src/app/shared/models/grupo.model';
import { GrupoService } from '../services/grupo.service';

@Component({
  selector: 'app-editar-grupo',
  templateUrl: './editar-grupo.component.html',
  styleUrls: ['./editar-grupo.component.css']
})
export class EditarGrupoComponent implements OnInit {
  @ViewChild("formGrupo") formGrupo!: NgForm;
  grupo!: Grupo;

  constructor(
    private grupoService: GrupoService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    let id = +this.route.snapshot.params['id'];
    const res = this.grupoService.buscarPorId(id);
    if (res !== undefined)
      this.grupo = res;
    else
      throw new Error("Grupo não encontrado: id = " + id);
  }

  atualizar(): void {
    if (this.formGrupo.form.valid) {
      this.grupoService.atualizar(this.grupo);
      this.router.navigate(['/usuarios']);
    }
  }

}
