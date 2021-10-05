  import { Component, OnInit, ViewChild } from '@angular/core';
  import { NgForm } from '@angular/forms';
  import { Router } from '@angular/router';
  import { Sistema } from 'src/app/shared/models/sistema.model';
  import { SistemaService } from '../service/sistema.service';
  
  @Component({
    selector: 'app-inserir-sistema',
    templateUrl: './inserir-sistema.component.html',
    styleUrls: ['./inserir-sistema.component.css']
  })
  
  export class InserirSistemaComponent implements OnInit {
    @ViewChild('formSistema') formSistema!: NgForm;
    sistema!: Sistema;
  
    constructor(
      private sistemaService: SistemaService,
      private router: Router
    ) { }
  
    ngOnInit(): void {
      this.sistema = new Sistema();
    }
  
    inserir(): void {
      if (this.formSistema.form.valid) {
        this.sistemaService.inserir(this.sistema);
        this.router.navigate(["/sistemas"]);
      }
    }
  
  }
  