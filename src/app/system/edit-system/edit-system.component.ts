import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { System } from 'src/app/shared/models/system.model';
import { SystemService } from '../services/system.service';
import { Location } from '@angular/common';
import { TeamService } from 'src/app/team/services/team.service';
import { Team } from 'src/app/shared/models/team.model';


@Component({
  selector: 'app-edit-system',
  templateUrl: './edit-system.component.html',
  styleUrls: ['./edit-system.component.css']
})
export class EditSystemComponent implements OnInit {
  system: System | undefined;
  systemForm: UntypedFormGroup = new UntypedFormGroup({
    name: new UntypedFormControl('', { validators: [Validators.required] }),
    description: new UntypedFormControl(''),
  })
  teamName = new UntypedFormControl('');


  constructor(
    private systemService: SystemService,
    private teamService: TeamService,
    private router: Router,
    private location: Location
  ) { }


  ngOnInit(): void {
    let state: any = this.location.getState();
    this.systemService.getSystem(state.companyId, state.systemId)
      .subscribe((systemData: System) => {
        this.system = systemData;
        this.systemForm.setValue({
          name: this.system.name,
          description: this.system.description,
        });
        this.fetchTeamName(this.system.companyId, this.system.teamId);

      })
  }

  fetchTeamName(companyId: string, teamId: string) {
    let sub = this.teamService.fetchTeam(companyId, teamId)
      .subscribe((teamData: Team) => {
        this.teamName.setValue(teamData.name!);
        sub?.unsubscribe();
      }
      );
  }

  
  onSubmit() {
    this.systemService.update( this.system?.companyId!, this.system?.id!, {...this.systemForm.value });
    this.router.navigate(["system/list"]);
  }


  onCancelOrExit() {
    this.router.navigate(["system/list"]);
  }


}
