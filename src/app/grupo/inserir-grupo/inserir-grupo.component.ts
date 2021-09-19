import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Grupo } from 'src/app/shared/models/grupo.model';
import { GrupoService } from '../services/grupo.service';

@Component({
  selector: 'app-inserir-grupo',
  templateUrl: './inserir-grupo.component.html',
  styleUrls: ['./inserir-grupo.component.css']
})
export class InserirGrupoComponent implements OnInit {
  @ViewChild('formGrupo') formGrupo!: NgForm;
  
  grupo!: Grupo;

  constructor(
    private grupoService: GrupoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.grupo = new Grupo();
  }

  inserir(): void {
    if (this.formGrupo.form.valid) {
      this.grupoService.inserir(this.grupo);
      this.router.navigate(["/grupos"]);
    }
  }

}
