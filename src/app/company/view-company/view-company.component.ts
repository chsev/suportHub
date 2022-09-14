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
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { TeamService } from 'src/app/team/services/team.service';
import { SystemService } from 'src/app/system/services/system.service';
import { JoinOpenTeamComponent } from './joinOpen-team/joinOpen-team.component';
import { JoinClosedTeamComponent } from './joinClosed-team/joinClosed-team.component';
import { Profile } from 'src/app/shared/models/profile.model';
import { BottomSheetOverviewMembersOptions } from './bottom-sheet-members-options/bottom-sheet-members-options';
import { ConfigurableFocusTrapFactory } from '@angular/cdk/a11y';
import { ConfirmExclusionCompanyComponent } from './confirm-exclusion-company/confirm-exclusion-company.component';


@Component({
  selector: 'app-view-company',
  templateUrl: './view-company.component.html',
  styleUrls: ['./view-company.component.css']
})
export class ViewCompanyComponent implements OnInit {

  members: Profile[] | undefined;
  membersColumns: string[] = ['name', 'email', 'position', 'expand'];
  dataSourceMembers = new MatTableDataSource<Profile>([]);
  @ViewChild('membersTable') membersTable: MatTable<Profile> | undefined;

  waitingApproval: Profile[] | undefined;
  waitingAppColumns: string[] = ['name', 'email', 'expand'];
  dataSourceWaitingApp = new MatTableDataSource<Profile>([]);
  @ViewChild('waitingApp') waitingAppTable: MatTable<Profile> | undefined;

  teams: Team[] = [];
  displayedColumnsTeams = ['name', 'description', 'nmembers', 'isopen', 'action'];
  dataSourceTeams = new MatTableDataSource<Team>([]);
  @ViewChild('teams') teamsTable: MatTable<Team> | undefined;

  systems: System[] = [];
  displayedColumnsSystems = ['name', 'description', 'ndocs', 'action'];
  dataSourceSystems = new MatTableDataSource<System>([]);
  @ViewChild('systems') systemsTable: MatTable<System> | undefined;

  user: User | undefined;
  company: Company | undefined;
  showCompanyCardContent = false;
  private userDataChangedSub!: Subscription;
  private teamChangedSub!: Subscription;
  isLoading = false;

private waitingApprovalSub: Subscription | undefined;
private membersSub: Subscription | undefined;

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
    if (this.teamChangedSub) { this.teamChangedSub.unsubscribe(); }
  }


  private getUser() {
    this.userDataChangedSub = this.accountService.userDataChanged
      .subscribe((userData: User) => {
        this.user = userData;
        this.fetchCompanyDoc(userData.companyId);
        this.fetchCompanyData(userData.companyId);
        this.fetchTeams(userData.companyId);
      });
    this.accountService.fetchUserData();
  }



  //=========
  // Company
  //=========
  private fetchCompanyDoc(companyID: string | undefined) {
    if (companyID) {
      this.companyService.fetchCompanyDoc(companyID)
        .subscribe((companyDoc) => {
          if (!this.company) {
            this.company = companyDoc;

            // this.getWaitingApproval(['44dvYb0VdnfyRXBdXrtED7afFAp1']);
            // this.getMembersData(['44dvYb0VdnfyRXBdXrtED7afFAp1', 
            // 'HJhHgF2trIOv3UUUfJYnzlCas6w2', 'v4yisPjzS5VTrzrjl6QX6pTKdSi2']);
          }
          else {
            this.company.id = companyDoc.id;
            this.company.name = companyDoc.name;
            this.company.description = companyDoc.description;
            this.company.segment = companyDoc.segment;
            this.company.nMembers = companyDoc.nMembers;
            this.company.isPublic = companyDoc.isPublic;
            this.company.isOpen = companyDoc.isOpen;
          }
        });
    }
  }

  private fetchCompanyData(companyID: string | undefined) {
    if (companyID) {
      this.companyService.fetchCompanyData(companyID)
        .subscribe((data) => {
          if (!this.company) {
            this.company = data;
          }
          else {
            this.company.members = data.members;
            this.company.administrators = data.administrators;
            this.company.waitingApproval = data.waitingApproval;


          }
          this.getMembersData(data.members ?? []);
          this.getWaitingApproval(data.waitingApproval ?? []);
        }
        )
    }
  }


  userIsCpyAdmin(usrId: string): boolean {
    if (this.company?.administrators?.includes(usrId)) {
      return true;
    }
    return false;
  }


  onEdit() {
    if (this.company?.id) {
      this.router.navigate(['company/edit'], { state: { id: this.company.id } });
    }
  }

  
  onDelete( ){
      const dialogRef: MatDialogRef<ConfirmExclusionCompanyComponent> = this.dialog.open(ConfirmExclusionCompanyComponent, {
        data: { company: this.company }
      });
      dialogRef.afterClosed().subscribe(answer => {
        if (answer) {
          console.log("Excluir!");
          this.companyService.remove(this.company?.id!);
        }
      });
  }

  exitCompany(){
      if (this.company && this.user) {
        this.companyService.removeMember(this.company.id!, this.user.id!);
        this.router.navigate(['company']);
      }
    
  }



  //=========
  // Members
  //=========
  private getMembersData(membersIds: string[]) {
    this.membersSub?.unsubscribe();
    this.membersSub = this.accountService.fetchProfileList(membersIds)
      .subscribe((membersList: Profile[]) => {
        if (membersList) {
          this.members = membersList;
          this.dataSourceMembers.data = membersList;
          this.membersTable!.renderRows();
        }
      });
  }


  openBottomSheet(userId: string): void {
    let prfl = this.members?.find(e => e.id == userId);
    this._bottomSheet.open(BottomSheetOverviewMembersOptions, {
      data: { 
        companyId: this.company?.id, 
        profile: prfl, 
        isAdmin: this.userIsCpyAdmin(userId), 
        curUser: this.user,
        curIsAdmin: this.userIsCpyAdmin(this.user?.id!)
      }
    });
  }



  //=========
  // Waiting for Approval list
  //=========
  private getWaitingApproval(ids: string[]) {
    this.waitingApprovalSub?.unsubscribe();
    this.waitingApprovalSub = this.accountService.fetchProfileList(ids)
      .subscribe((profilesList: Profile[]) => {
          this.waitingApproval = profilesList;
          this.dataSourceWaitingApp.data = profilesList;
          this.waitingAppTable!.renderRows();
      });
  }


  approveMember(usrId: string) {
    let i = this.dataSourceWaitingApp.data.findIndex(e => e.id == usrId);
    if (this.company && i>-1) {
      this.dataSourceWaitingApp.data.splice(i, 1);
      this.waitingAppTable!.renderRows();
      this.companyService.acceptMember(this.company.id!, usrId);
      // this.accountService.updateUserCompany(this.company.id!, usrId);
    }
  }


  rejectMember(usrId: string) {
    let i = this.dataSourceWaitingApp.data.findIndex(e => e.id == usrId);
    if (this.company  && i>-1) {
      this.dataSourceWaitingApp.data.splice(i, 1);
      this.waitingAppTable!.renderRows();
      this.companyService.rejectMember(this.company.id!, usrId);
    }
  }



  //=========
  // Teams
  //=========
  private fetchTeams(companyId: string | undefined) {
    if (companyId) {
      this.teamChangedSub = this.teamService.teamArrayChanged
        .subscribe((data: Team[]) => {
          this.teams = data;
          this.dataSourceTeams.data = data;

          //will only fetch systems linked to teams
          let allSystems: string[] = [];
          this.teams.forEach(t => t.systems ? allSystems.push(...t.systems) : '');
          this.getSystemsData(allSystems);
        })
      this.teamService.fetchTeams(companyId)
    }
  }


  userIsTeamMember(teamId: string, usrId: string): boolean {
    let t = this.teams.find(e => e.id === teamId);
    if (t && t.members?.includes(usrId)) {
      return true;
    }
    return false;
  }


  onViewTeam(teamId: string) {
    let t = this.teams.find(e => e.id == teamId);
    this.router.navigate(['team/view'], { state: { teamId: t?.id, companyId: t?.companyId } });
  }


  onNewTeam() {
    this.router.navigate(['team/new']);
  }


  joinTeam(teamId: string) {
    let team = this.teams.find(t => t.id == teamId);
    if (!team) {
      return;
    }
    team.isOpen ? this.joinOpenTeam(team) : this.joinClosedTeam(team);
  }


  private joinOpenTeam(team: Team) {
    const dialogRef: MatDialogRef<JoinOpenTeamComponent> = this.dialog.open(JoinOpenTeamComponent, {
      data: { name: team.name }
    });

    dialogRef.afterClosed().subscribe(answer => {
      if (answer) {
        // console.log("Aceitou Open");
        this.teamService.addMember(this.company?.id!, team.id!, this.user?.id!);
      }
    });
  }


  private joinClosedTeam(team: Team) {
    const dialogRef: MatDialogRef<JoinClosedTeamComponent> = this.dialog.open(JoinClosedTeamComponent, {
      data: { name: team.name }
    });

    dialogRef.afterClosed().subscribe(answer => {
      if (answer) {
        console.log("Aceitou Closed");
        this.teamService.requestApproval(this.company?.id!, team.id!, this.user?.id!);
      }
    });
  }



  //=========
  // Systems
  //=========
  private getSystemsData(systemsIds: string[]): void {
    this.systemService.fetchSystemDocList(this.company?.id!, systemsIds)
      .subscribe((systemsList) => {
        this.systems = systemsList;
        this.dataSourceSystems.data = systemsList;
        this.systemsTable?.renderRows();
      })
  }


  onViewSystem(systemId: string) {
    let s = this.systems.find(e => e.id == systemId);
    this.router.navigate(['system/view'], { state: { companyId: s?.companyId, systemId: s?.id } });
  }



}

