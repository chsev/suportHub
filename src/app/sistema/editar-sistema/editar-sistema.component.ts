import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Sistema } from 'src/app/shared/models/sistema.model';
import { SistemaService } from '../service/sistema.service';

@Component({
  selector: 'app-editar-sistema',
  templateUrl: './editar-sistema.component.html',
  styleUrls: ['./editar-sistema.component.css']
})
export class EditarSistemaComponent implements OnInit {
  @ViewChild("formSistema") formSistema!: NgForm;
  sistema!: Sistema;

  constructor(
    private sistemaService: SistemaService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    let id = +this.route.snapshot.params['id'];
    const res = this.sistemaService.buscarPorId(id);
    if (res !== undefined)
      this.sistema = res;
    else
      throw new Error("Sistema não encontrado: id = " + id);
  }

  atualizar(): void {
    if (this.formSistema.form.valid) {
      this.sistemaService.atualizar(this.sistema);
      this.router.navigate(['/sistemas']);
    }
  }

}
