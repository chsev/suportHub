import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/account/services/account.service';
import { Team } from 'src/app/shared/models/team.model';
import { User } from 'src/app/shared/models/user.model';
import { TeamService } from '../services/team.service';

@Component({
  selector: 'app-create-team',
  templateUrl: './create-team.component.html',
  styleUrls: ['./create-team.component.css']
})
export class CreateTeamComponent implements OnInit {
  teamForm!: UntypedFormGroup;
  administrator = new UntypedFormControl('');
  user: User | undefined;
  private userDataChangedSub: Subscription | undefined;

  constructor(
    private router: Router,
    private teamService: TeamService,
    private accountService: AccountService,
  ) { }

  ngOnInit(): void {
    this.teamForm = new UntypedFormGroup({
      name: new UntypedFormControl('',  {validators: [Validators.required]}),
      description: new UntypedFormControl('', {validators: [Validators.required]}),
      isOpen: new UntypedFormControl(false),
    })

    this.userDataChangedSub = this.accountService.userDataChanged
      .subscribe( (userData: User) => {
        this.user = userData;
        this.administrator.setValue(`${this.user.name} (${this.user.email})`)
      })
    this.accountService.fetchUserData();
  }

  ngOnDestroy(): void {
    this.userDataChangedSub?.unsubscribe();
  }

  onSubmit(){
    let newTeam: Team = {
      ...this.teamForm.value, 
      administrators: [this.user?.id], 
      members: [this.user?.id], 
      companyId: this.user?.companyId! 
    }
    this.teamService.insert(newTeam);
    this.router.navigate(["team/list"]);
  }

  onCancel(){
    this.router.navigate(["team/list"]);
  }

}
