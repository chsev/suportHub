import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Equipe } from 'src/app/shared/models/equipe.model';
import { EquipeService } from '../service/equipe.service';

@Component({
  selector: 'app-inserir-equipe',
  templateUrl: './inserir-equipe.component.html',
  styleUrls: ['./inserir-equipe.component.css']
})
export class InserirEquipeComponent implements OnInit {

  @ViewChild('formEquipe') formEquipe!: NgForm;

  equipe!: Equipe;

  constructor(
    private equipeService: EquipeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.equipe = new Equipe();
  }

  inserir(): void {
    if (this.formEquipe.form.valid) {
      this.equipeService.inserir(this.equipe);
      this.router.navigate(["/equipes"]);
    }
  }
}
