import { Component, OnInit, ViewChild } from '@angular/core';
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
import { ConfirmExclusionCompanyComponent } from './confirm-exclusion-company/confirm-exclusion-company.component';
import { Timestamp } from 'firebase/firestore';
import { Post } from 'src/app/shared/models/post.model';
import { PostService } from 'src/app/post/services/post.service';
import { SendInviteCompanyComponent } from './send-invite-company/send-invite-company.component';


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

  teams: Team[] | undefined;
  displayedColumnsTeams = ['name', 'description', 'nmembers', 'nsystems', 'isopen', 'action'];
  dataSourceTeams = new MatTableDataSource<Team>([]);
  @ViewChild('teamsTable') teamsTable: MatTable<Team> | undefined;

  systems: System[] | undefined;
  displayedColumnsSystems = ['name', 'description', 'ndocs', 'action'];
  dataSourceSystems = new MatTableDataSource<System>([]);
  @ViewChild('systemsTable') systemsTable: MatTable<System> | undefined;

  user: User | undefined;
  company: Company | undefined;
  showCompanyCardContent = false;
  private userDataChangedSub: Subscription | undefined;
  private waitingApprovalSub: Subscription | undefined;
  private membersSub: Subscription | undefined;
  isLoading = false;

  posts: Post[] = [];
  authors: Profile[] = [];


  constructor(
    private companyService: CompanyService,
    private accountService: AccountService,
    private teamService: TeamService,
    private systemService: SystemService,
    private postService: PostService,
    private router: Router,
    private _bottomSheet: MatBottomSheet,
    private dialog: MatDialog
  ) { }


  ngOnInit(): void {
    this.getUser();
  }


  ngOnDestroy(): void {
    this.userDataChangedSub?.unsubscribe();
    this.waitingApprovalSub?.unsubscribe();
    this.membersSub?.unsubscribe();
    this.systemsTable = undefined;
    this.waitingAppTable = undefined;
    this.membersTable = undefined;
  }


  private getUser() {
    this.userDataChangedSub = this.accountService.userDataChanged
      .subscribe((userData: User) => {
        this.user = userData;
        this.fetchCompanyDoc(userData.companyId);
        this.fetchCompanyData(userData.companyId);
        this.fetchTeams(userData.companyId);
        this.getPosts(userData.companyId);
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
          }
          else {
            this.updateCompanyData(companyDoc);
          }
        });
    }
  }

  private updateCompanyData(companyDoc: Company) {
    if(this.company){
      this.company.id = companyDoc.id;
      this.company.name = companyDoc.name;
      this.company.description = companyDoc.description;
      this.company.segment = companyDoc.segment;
      this.company.nMembers = companyDoc.nMembers;
      this.company.isPublic = companyDoc.isPublic;
      this.company.isOpen = companyDoc.isOpen;
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
        });
    }
  }


  isCompanyAdmin(usrId: string): boolean {
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


  onDelete() {
    const dialogRef: MatDialogRef<ConfirmExclusionCompanyComponent> = this.dialog.open(ConfirmExclusionCompanyComponent, {
      data: { company: this.company }
    });
    dialogRef.afterClosed().subscribe(answer => {
      if (answer && this.company) {
        this.companyService.remove(this.company.id!);
        this.router.navigate(['company']);
      }
    });
  }

  exitCompany() {
    if (this.company && this.user) {
      this.teamService.removeFromAll(this.company.id!, this.user.id!);
      this.companyService.removeMember(this.company.id!, this.user.id!);
      this.router.navigate(['company']);
    }

  }


  openSendInviteDialog(){
    const dialogRef: MatDialogRef<SendInviteCompanyComponent> = this.dialog.open(SendInviteCompanyComponent, {
      data: { company: this.company }
    });

    dialogRef.afterClosed().subscribe(answer => {
      if (answer && this.company) {
        this.companyService.createInvitation(this.company.id!, answer)
      }
    });
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
          this.membersTable?.renderRows();
        }
      });
  }


  openBottomSheet(userId: string): void {
    let prfl = this.members?.find(e => e.id == userId);
    this._bottomSheet.open(BottomSheetOverviewMembersOptions, {
      data: {
        companyId: this.company?.id,
        profile: prfl,
        isAdmin: this.isCompanyAdmin(userId),
        curUser: this.user,
        curIsAdmin: this.isCompanyAdmin(this.user?.id!)
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
        this.waitingAppTable?.renderRows();
      });
  }


  approveMember(usrId: string) {
    let i = this.dataSourceWaitingApp.data.findIndex(e => e.id == usrId);
    if (this.company && i > -1 && this.isCompanyAdmin(this.user?.id!)) {
      this.dataSourceWaitingApp.data.splice(i, 1);
      this.waitingAppTable?.renderRows();
      this.companyService.acceptMember(this.company.id!, usrId);
    }
  }


  rejectMember(usrId: string) {
    let i = this.dataSourceWaitingApp.data.findIndex(e => e.id == usrId);
    if (this.company && i > -1 && this.isCompanyAdmin(this.user?.id!)) {
      this.dataSourceWaitingApp.data.splice(i, 1);
      this.waitingAppTable?.renderRows();
      this.companyService.rejectMember(this.company.id!, usrId);
    }
  }



  //=========
  // Teams
  //=========
  private fetchTeams(companyId: string | undefined) {
    if (companyId) {
      this.teamService.fetchCompanyTeams(companyId)
        .subscribe((data: Team[]) => {
          this.teams = data;
          this.dataSourceTeams.data = data;

          //will only fetch systems linked to teams
          let allSystems: string[] = [];
          this.teams.forEach(t => t.systems ? allSystems.push(...t.systems) : '');
          this.getSystemsData(allSystems);
        })
    }
  }


  userIsTeamMember(teamId: string, usrId: string): boolean {
    let t = this.teams?.find(e => e.id === teamId);
    if (t && t.members?.includes(usrId)) {
      return true;
    }
    return false;
  }


  onViewTeam(teamId: string) {
    let t = this.teams?.find(e => e.id == teamId);
    this.router.navigate(['team/view'], { state: { teamId: t?.id, companyId: t?.companyId } });
  }


  onNewTeam() {
    this.router.navigate(['team/new']);
  }


  joinTeam(teamId: string) {
    let team = this.teams?.find(t => t.id == teamId);
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
        this.teamService.requestApproval(this.company?.id!, team.id!, this.user?.id!);
      }
    });
  }


  //=========
  // Systems
  //=========
  private getSystemsData(systemsIds: string[]): void {
    this.systemService.getSystemList(this.company?.id!, systemsIds)
      .subscribe((systemsList) => {
        this.systems = systemsList;
        this.dataSourceSystems.data = systemsList;
        this.systemsTable?.renderRows();
      })
  }


  onViewSystem(systemId: string) {
    let sys = this.systems?.find(e => e.id == systemId);
    if (sys) {
      this.router.navigate(['system/view'], { state: { companyId: sys.companyId, systemId: sys.id } });
    }
  }


  canAccessSystem(systemId: string, userId: string): boolean {
    let sys = this.systems?.find(e => e.id === systemId);
    let t = this.teams?.find(e => e.id == sys?.teamId);
    let canAccess = t?.members?.includes(userId);
    return canAccess ?? false;
  }


  //==================
  //   Posts:
  //==================
  getPosts(companyId: string | undefined) {
    if (!companyId) return;

    this.postService.fetchCompanyPosts(companyId)
      .subscribe(posts => {
        this.posts = posts;
        let authorsIds = [...new Set(this.posts.map(e => e.usrId))]; //remove duplicates
        this.getAuthors(authorsIds);
      });
  }


  private getAuthors(authorsIds: string[]) {
    this.accountService.fetchProfileList(authorsIds)
      .subscribe((profiles) => {
        this.authors = profiles;
      });
  }


  toDate(timestamp: Timestamp): string {
    if(!timestamp){
      return '';
    }
    return timestamp.toDate().toLocaleString('pt-br');
  }


  getAuthor(id: string): Profile | undefined {
    return this.authors.find(e => e.id == id);
  }


  toggleLike(postId: string) {
    this.postService.toggleLike(this.company?.id!, postId, this.user?.id!);
  }

  
  userLiked(post: Post): boolean {
    if (this.user && post) {
      return post.liked.includes(this.user.id!);
    }
    return false;
  }


  viewPost(postId: string) {
    this.router.navigate(['post/view', postId]);
  }


  onAddPost() {
    this.router.navigate(['post/new'], {
      state: {
        teamId: undefined,
        companyId: this.company?.id,
        usrId: this.user!.id,
        type: 'companyPost'
      }
    });;
  }


}

