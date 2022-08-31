import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/account/services/account.service';
import { Company } from 'src/app/shared/models/company.model';
import { System } from 'src/app/shared/models/system.model';
import { Team } from 'src/app/shared/models/team.model';
import { User } from 'src/app/shared/models/user.model';
import { CompanyService } from '../services/company.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { TeamService } from 'src/app/team/services/team.service';
import { SystemService } from 'src/app/system/services/system.service';
import { JoinOpenTeamComponent } from './joinOpen-team/joinOpen-team.component';
import { JoinClosedTeamComponent } from './joinClosed-team/joinClosed-team.component';


export interface UserFlagged extends User {
  isAdmin?: boolean;
}


@Component({
  selector: 'app-view-company',
  templateUrl: './view-company.component.html',
  styleUrls: ['./view-company.component.css']
})
export class ViewCompanyComponent implements OnInit {

  members: UserFlagged[] = [];
  membersColumns: string[] = ['name', 'email', 'position', 'expand'];
  dataSourceMembers = new MatTableDataSource<UserFlagged>();
  @ViewChild('members') membersTable: MatTable<UserFlagged> | undefined;

  teams: Team[] = [];
  displayedColumnsTeams = ['name', 'description', 'nmembers', 'isopen', 'action'];
  dataSourceTeams = new MatTableDataSource<Team>();
  @ViewChild('teams') teamsTable: MatTable<Team> | undefined;


  systems: System[] = [];
  displayedColumnsSystems = ['name', 'description', 'ndocs', 'action'];
  dataSourceSystems = new MatTableDataSource<System>();
  @ViewChild('systems') systemsTable: MatTable<System> | undefined;

  user: User | undefined;
  company: Company | undefined;
  showCompanyCardContent = false;
  private userDataChangedSub!: Subscription;
  private teamChangedSub!: Subscription;

  isLoading = false;
  userIsAdmin = false;


  constructor(
    private companyService: CompanyService,
    private accountService: AccountService,
    private teamService: TeamService,
    private systemService: SystemService,
    private router: Router,
    private _bottomSheet: MatBottomSheet,
    private dialog: MatDialog
  ) { }


 


  ngOnInit(): void {
    this.getUser();
  }

  ngOnDestroy(): void {
    if (this.userDataChangedSub) { this.userDataChangedSub.unsubscribe(); }
    if( this.teamChangedSub){ this.teamChangedSub.unsubscribe(); }
  }


  private getUser() {
    this.userDataChangedSub = this.accountService.userDataChanged.subscribe(
        (userData: User) => {
          this.user = userData;
          this.fetchCompanyData(userData.companyId);
        }
      );
    this.accountService.fetchUserData();
  }


  private fetchCompanyData(companyID: string | undefined) {
    if (companyID) {
      this.companyService.fetchCompanyDoc(companyID)
        .subscribe((data) => {
          if (data) {
            this.company = data;
            if(this.company.administrators?.includes(this.user?.id!)){

              //debug:
              console.log('administrators:');
              console.log(this.company.administrators);
              console.log('user id:');
              console.log(this.user?.id!);
              console.log('compare:');
              console.log(this.company.administrators?.includes(this.user?.id!));

              this.userIsAdmin = true;
            }
            this.getMembersData();
            this.fetchTeams(this.company.id);
          }
        });
    }
  }

  private fetchTeams(companyId: string | undefined){
    if(companyId){
      this.teamChangedSub = this.teamService.teamArrayChanged
        .subscribe( (data: Team[]) => {
          this.teams = data;
          this.dataSourceTeams.data = data;

          //will only fetch systems linked to teams
          let allSystems: string[] = [];
          this.teams.forEach( t => t.systems? allSystems.push(...t.systems): '' );
          this.getSystemsData(allSystems);
        })
      this.teamService.fetchTeams(companyId)
    }
  }


  private getMembersData() {
    this.accountService
      .fetchUserDocList(['44dvYb0VdnfyRXBdXrtED7afFAp1', 'HJhHgF2trIOv3UUUfJYnzlCas6w2', 'v4yisPjzS5VTrzrjl6QX6pTKdSi2'])
      .subscribe( (mebersList: User[]) => {
          if (mebersList) {
            let flaggedMembers = mebersList.map(value => this.toUserFlaged(value));
            this.members = flaggedMembers;
            this.dataSourceMembers.data = flaggedMembers;
            this.membersTable!.renderRows();
          }
      });
  }


  private getSystemsData(systemsIds: string[]): void {
    this.systemService.fetchSystemDocList(this.company?.id!, systemsIds)
    .subscribe((systemsList)=>{
      this.systems = systemsList;
      this.dataSourceSystems.data = systemsList;
      this.systemsTable?.renderRows();
    })
  }



  onViewTeam(teamId: string){
    let t = this.teams.find( e => e.id == teamId);
    this.router.navigate(['team/view'], {state: {teamId: t?.id, companyId: t?.companyId}});
  }


  onEdit() {
    if (this.company?.id) {
      this.router.navigate(['company/edit'], {state: {id: this.company.id}});
    }
  }

  onNewTeam(){
    this.router.navigate(['team/new']);
  }

  joinTeam(teamId: string){
    let team = this.teams.find(t => t.id == teamId);
    if(!team){
      return;
    }

    if(team.isOpen){
      this.joinOpenTeam(team);
    }
    else{
      this.joinClosedTeam(team);
    }
  }

  joinOpenTeam(team: Team){
    const dialogRef: MatDialogRef<JoinOpenTeamComponent> = this.dialog.open(JoinOpenTeamComponent, {
      data: { name: team.name }
    });

    dialogRef.afterClosed().subscribe(answer => {
      if (answer) {
        console.log("Aceitou Open");
        // this.accountService.updateCompany(company.id!);
        // this.companyService.addMember(company.id!, this.accountService.getUser()?.id!)
      }
    });
  }

  joinClosedTeam(team: Team){
    const dialogRef: MatDialogRef<JoinClosedTeamComponent> = this.dialog.open(JoinClosedTeamComponent, {
      data: { name: team.name }
    });

    dialogRef.afterClosed().subscribe(answer => {
      if (answer) {
        console.log("Aceitou Closed");
        // this.accountService.updateCompany(company.id!);
        // this.companyService.addMember(company.id!, this.accountService.getUser()?.id!)
      }
    });
  }

  onViewSystem(systemId: string){
    let s = this.systems.find(e => e.id == systemId);
    this.router.navigate(['system/view'], {state: {companyId: s?.companyId, systemId: s?.id}});
  }


  openBottomSheet(userId: string): void {
    let usr = this.members.find( e => e.id == userId);
    this._bottomSheet.open(BottomSheetOverviewMembersOptions, {
      data: {name: usr?.name, email: usr?.email, isAdmin: usr?.isAdmin}
    });
  }

  toUserFlaged(user: User): UserFlagged {
    let adminFlag: boolean = this.company?.administrators?.includes(user.id!)? true : false;
    return { ...user, isAdmin: adminFlag }
  }

}


@Component({
  selector: 'bottom-sheet-members-options',
  templateUrl: 'bottom-sheet-members-options.html',
})
export class BottomSheetOverviewMembersOptions {
  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private _bottomSheetRef: MatBottomSheetRef<BottomSheetOverviewMembersOptions>
    ) {}

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
}