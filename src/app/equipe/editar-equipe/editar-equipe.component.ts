import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Equipe } from 'src/app/shared/models/equipe.model';
import { EquipeService } from '../service/equipe.service';

@Component({
  selector: 'app-editar-equipe',
  templateUrl: './editar-equipe.component.html',
  styleUrls: ['./editar-equipe.component.css']
})
export class EditarEquipeComponent implements OnInit {
  @ViewChild("formEquipe") formEquipe!: NgForm;

  equipe!: Equipe;

  constructor(
    private equipeService: EquipeService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    let id = +this.route.snapshot.params['id'];
    const res = this.equipeService.buscarPorId(id);
    if (res !== undefined)
      this.equipe = res;
    else
      throw new Error("Equipe não encontrada: id = " + id);
  }

  atualizar(): void {
    if (this.formEquipe.form.valid) {
      this.equipeService.atualizar(this.equipe);
      this.router.navigate(['/equipes']);
    }
  }

}
