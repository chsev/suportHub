import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TeamService } from '../services/team.service';

@Component({
  selector: 'app-create-team',
  templateUrl: './create-team.component.html',
  styleUrls: ['./create-team.component.css']
})
export class CreateTeamComponent implements OnInit {
  teamForm!: FormGroup;

  constructor(
    private router: Router,
    private teamService: TeamService
  ) { }

  ngOnInit(): void {
    this.teamForm = new FormGroup({
      name: new FormControl('',  {validators: [Validators.required]}),
      description: new FormControl(''),
    })
  }

  onSubmit(){
    this.teamService.insert(this.teamForm.value);
    this.router.navigate(["team/list"]);
  }

  onCancel(){
    this.router.navigate(["team/list"]);
  }

}
