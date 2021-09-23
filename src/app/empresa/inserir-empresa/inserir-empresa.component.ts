import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Empresa } from 'src/app/shared/models/empresa.model';
import { EmpresaService } from '../services/empresa.service';

@Component({
  selector: 'app-inserir-empresa',
  templateUrl: './inserir-empresa.component.html',
  styleUrls: ['./inserir-empresa.component.css']
})
export class InserirEmpresaComponent implements OnInit {
  @ViewChild('formEmpresa') formEmpresa!: NgForm;
  
  empresa!: Empresa;

  constructor(
    private empresaService: EmpresaService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.empresa = new Empresa();
  }

  inserir(): void {
    if (this.formEmpresa.form.valid) {
      this.empresaService.inserir(this.empresa);
      this.router.navigate(["/empresas"]);
    }
  }

}
