import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TeamService } from '../services/team.service';

@Component({
  selector: 'app-create-team',
  templateUrl: './create-team.component.html',
  styleUrls: ['./create-team.component.css']
})
export class CreateTeamComponent implements OnInit {
  teamForm!: UntypedFormGroup;

  constructor(
    private router: Router,
    private teamService: TeamService
  ) { }

  ngOnInit(): void {
    this.teamForm = new UntypedFormGroup({
      name: new UntypedFormControl('',  {validators: [Validators.required]}),
      description: new UntypedFormControl(''),
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
