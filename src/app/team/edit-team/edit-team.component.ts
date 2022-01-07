import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Team } from 'src/app/shared/models/team.model';
import { TeamService } from '../services/team.service';

@Component({
  selector: 'app-edit-team',
  templateUrl: './edit-team.component.html',
  styleUrls: ['./edit-team.component.css']
})
export class EditTeamComponent implements OnInit {
  teamId!: string | null;
  team!: any;
  teamForm: FormGroup = new FormGroup({
    name: new FormControl('', { validators: [Validators.required] }),
    description: new FormControl(''),
  })

  constructor(
    private teamService: TeamService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.teamId = this.teamService.editingTeamId;

    if (!this.teamId) {
      this.onCancelOrExit();
    } else {
      this.teamService.editingTeamChanged
        .subscribe(payload => {
          this.team = payload as Team;
          this.teamForm.setValue({
            name: payload.name,
            description: payload.description,
          })
        }
        );
      this.teamService.searchById(this.teamId)
    }
  }


  onSubmit() {
    this.teamService.update({ id: this.teamId, ...this.teamForm.value });
    this.router.navigate(["team/list"]);
  }


  onCancelOrExit() {
    this.router.navigate(["team/list"]);
  }


}
