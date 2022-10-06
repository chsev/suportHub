import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SystemService } from '../services/system.service';
import { Location } from '@angular/common';
import { TeamService } from 'src/app/team/services/team.service';
import { Team } from 'src/app/shared/models/team.model';

@Component({
  selector: 'app-create-system',
  templateUrl: './create-system.component.html',
  styleUrls: ['./create-system.component.css']
})
export class CreateSystemComponent implements OnInit {
  systemForm!: UntypedFormGroup;
  teamId: string | undefined;
  companyId: string | undefined;
  teamName = new UntypedFormControl('');
  

  constructor(
    private router: Router,
    private systemService: SystemService,
    private teamService: TeamService,
    private location: Location
  ) { }


  ngOnInit(): void {
    this.systemForm = new UntypedFormGroup({
      name: new UntypedFormControl('',  {validators: [Validators.required]}),
      description: new UntypedFormControl(''),
    })

    let state: any = this.location.getState();
    this.companyId = state.companyId;
    this.teamId = state.teamId;
    this.fetchTeam(state);
  }


  private fetchTeam(state: any) {
    this.teamService.fetchTeam(state.companyId, state.teamId)
      .subscribe((teamData: Team) => {
        this.teamName.setValue(teamData.name!);
      });
  }


  async onSubmit(){
    let newid = await this.systemService.insert({...this.systemForm.value, teamId: this.teamId, companyId: this.companyId})
    if(newid){
      this.teamService.addSystem(this.companyId!, this.teamId!, newid);
    }
    this.router.navigate(["system/list"]);
  }

  
  onCancel(){
    this.router.navigate(["system/list"]);
  }

}
