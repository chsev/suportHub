import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Team } from 'src/app/shared/models/team.model';
import { TeamService } from '../services/team.service';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/account/services/account.service';

@Component({
  selector: 'app-edit-team',
  templateUrl: './edit-team.component.html',
  styleUrls: ['./edit-team.component.css']
})
export class EditTeamComponent implements OnInit {
  team: Team | undefined;
  private userSub: Subscription | undefined;
  administrators: UntypedFormControl[] = [];
  teamForm: UntypedFormGroup = new UntypedFormGroup({
    name: new UntypedFormControl('', { validators: [Validators.required] }),
    description: new UntypedFormControl(''),
    isOpen: new UntypedFormControl(false),
  })

  constructor(
    private teamService: TeamService,
    private accountService: AccountService,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit(): void {
    let state: any = this.location.getState();
    this.teamService.fetchTeamDoc(state.companyId, state.teamId).subscribe(
      (teamData: Team) => {
        this.team = teamData;
        this.teamForm.setValue({
          name: this.team.name,
          description: this.team.description,
          isOpen: this.team.isOpen
        });
        this.fetchAdmin(this.team.administrators!);
      }
    )
  }


  onSubmit() {
    if(this.team){
      this.teamService.update(this.team.companyId!, this.team.id!, { ...this.teamForm.value });
    }
    this.router.navigate(["team/list"]);
  }


  onCancelOrExit() {
    this.router.navigate(["team/list"]);
  }


  private fetchAdmin(uids: string[]) {
    this.userSub = this.accountService.fetchUserDocList(uids)
      .subscribe(data => {
        this.administrators = data
          .map(usr => new UntypedFormControl(`${usr.name} (${usr.email})`));
      })
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
  }


}
