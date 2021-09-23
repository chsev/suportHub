import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Empresa } from 'src/app/shared/models/empresa.model';
import { EmpresaService } from '../services/empresa.service';

@Component({
  selector: 'app-editar-empresa',
  templateUrl: './editar-empresa.component.html',
  styleUrls: ['./editar-empresa.component.css']
})
export class EditarEmpresaComponent implements OnInit {
  @ViewChild("formEmpresa") formEmpresa!: NgForm;
  empresa!: Empresa;

  constructor(
    private empresaService: EmpresaService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    let id = +this.route.snapshot.params['id'];
    const res = this.empresaService.buscarPorId(id);
    if (res !== undefined)
      this.empresa = res;
    else
      throw new Error("Empresa não encontrado: id = " + id);
  }

  atualizar(): void {
    if (this.formEmpresa.form.valid) {
      this.empresaService.atualizar(this.empresa);
      this.router.navigate(['/usuarios']);
    }
  }

}
