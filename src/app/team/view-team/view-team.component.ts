import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Team } from 'src/app/shared/models/team.model';
import { Location } from '@angular/common';
import { TeamService } from '../services/team.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/shared/models/user.model';
import { AccountService } from 'src/app/account/services/account.service';
import { Subscription } from 'rxjs';
import { UiService } from 'src/app/shared/services/ui.service';
import { Router } from '@angular/router';
import { System } from 'src/app/shared/models/system.model';
import { SystemService } from 'src/app/system/services/system.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Post } from 'src/app/shared/models/post.model';
import { Timestamp } from 'firebase/firestore';
import { Profile } from 'src/app/shared/models/profile.model';
import { PostService } from 'src/app/post/services/post.service';
import { BottomSheetTeamComponent } from './bottom-sheet-team/bottom-sheet-team.component';
import { ConfirmExclusionTeamComponent } from './confirm-exclusion-team/confirm-exclusion-team.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-view-team',
  templateUrl: './view-team.component.html',
  styleUrls: ['./view-team.component.css']
})
export class ViewTeamComponent implements OnInit {
  companyId: string | undefined;
  team: Team | undefined;
  user: User | undefined;
  userIsAdmin = true;
  isLoading = false;

  members: Profile[] | undefined;
  displayedColumnsMembers = ['name', 'email', 'position', 'expand'];
  dataSourceMembers = new MatTableDataSource<Profile>([]);
  @ViewChild('membersTable') membersTable: MatTable<Profile> | undefined;

  waitingApproval: Profile[] | undefined;
  waitingAppColumns: string[] = ['name', 'email', 'expand'];
  dataSourceWaitingApp = new MatTableDataSource<Profile>([]);
  @ViewChild('waitingAppTable') waitingAppTable: MatTable<Profile> | undefined;

  displayedColumnsSystems = ['name', 'description', 'action'];
  dataSourceSystems = new MatTableDataSource<System>([]);
  @ViewChild('systems') systemsTable: MatTable<System> | undefined;

  posts: Post[] = [];
  authors: Profile[] = [];

  private teamSub: Subscription | undefined;
  private membersSub: Subscription | undefined;
  private loadingSub: Subscription | undefined;
  private userDataChangedSub: Subscription | undefined;
  private waitingApprovalSub: Subscription | undefined;


  constructor(
    private uiService: UiService,
    private router: Router,
    private location: Location,
    private teamService: TeamService,
    private accountService: AccountService,
    private systemService: SystemService,
    private postService: PostService,
    private _bottomSheet: MatBottomSheet,
    private dialog: MatDialog
  ) { }


  ngOnInit(): void {
    this.loadingSub = this.uiService.loadingStateChanged
      .subscribe(isLoading => this.isLoading = isLoading);

    let state: any = this.location.getState();
    this.companyId = state.companyId;
    this.getUser();
    this.getTeamData(state);
    this.getPosts(state);
  }


  ngOnDestroy(): void {
    this.teamSub?.unsubscribe();
    this.membersSub?.unsubscribe();
    this.loadingSub?.unsubscribe();
    this.userDataChangedSub?.unsubscribe();
  }


  private getTeamData(state: any) {
    this.teamSub = this.teamService.fetchTeam(state.companyId, state.teamId)
      .subscribe((teamData: Team) => {
        this.team = teamData;
        this.getMembersData(this.team.members ?? []);
        this.getSystemsData(this.team.systems ?? []);
        this.getWaitingApproval(this.team.waitingApproval ?? []);
      });
  }


  private getUser() {
    this.userDataChangedSub = this.accountService.userDataChanged
      .subscribe(
        (userData: User) => this.user = userData
      );
    this.accountService.fetchUserData();
  }


  private getMembersData(membersIds: string[]): void {
    this.membersSub = this.accountService.fetchProfileList(membersIds)
      .subscribe((usersList) => {
        if (usersList) {
          this.members = usersList;
          this.dataSourceMembers.data = usersList;
          this.membersTable?.renderRows();
        }
      });
  }


  isTeamAdmin(usrId: string): boolean {
    if (this.team?.administrators?.includes(usrId)) {
      return true;
    }
    return false;
  }


  private getSystemsData(systemsIds: string[]): void {
    this.systemService.getSystemList(this.team?.companyId!, systemsIds)
      .subscribe((systemsList) => {
        this.dataSourceSystems.data = systemsList;
        this.systemsTable?.renderRows();
      });
  }

  getPosts(state: any) {
    this.postService.fetchTeamPosts(state.companyId, state.teamId)
      .subscribe( posts => {
        this.posts = posts;
        let authorsIds = [...new Set( this.posts.map(e => e.usrId) )]; //remove duplicates
        this.getAuthors(authorsIds);
      });
  }

  
  private getAuthors(authorsIds: string[]) {
    this.accountService.fetchProfileList(authorsIds)
      .subscribe((profiles) => {
        this.authors = profiles;
      });
  }


  //==================
  //   this Team:
  //==================
  canEdit(): boolean{
    if(this.user?.id){
      return this.team?.administrators?.includes(this.user.id) ?? false;
    }
    return false;
  }


  onEdit() { //edit this team
    if (this.team) {
      this.router.navigate(['team/edit'], { state: { companyId: this.team.companyId, teamId: this.team.id } });
    }
  }

  onDelete( ){
    const dialogRef: MatDialogRef<ConfirmExclusionTeamComponent> = this.dialog.open(ConfirmExclusionTeamComponent, {
      data: { team: this.team }
    });
    dialogRef.afterClosed().subscribe(answer => {
      if (answer && this.companyId && this.team) {
        this.teamService.delete(this.companyId!, this.team.id!);
      }
    });
}


  //==================
  //   System:
  //==================
  onAddSystem() {
    this.router.navigate(['system/new'], { state: { teamId: this.team?.id, companyId: this.team?.companyId } });
  }


  onViewSystem(systemId: string) {
    let s = this.dataSourceSystems.data.find(e => e.id == systemId);
    this.router.navigate(['system/view'], { state: { companyId: s?.companyId, systemId: s?.id } });
  }


  //==================
  //   Members:
  //==================
  openBottomSheet(userId: string): void {
    let prfl = this.dataSourceMembers.data.find(e => e.id == userId);
    this._bottomSheet.open(BottomSheetTeamComponent, {
      data: {      
        companyId: this.companyId, 
        teamId: this.team?.id!,
        profile: prfl, 
        isAdmin: this.isTeamAdmin(userId), 
        curUser: this.user,
        curIsAdmin: this.isTeamAdmin(this.user?.id!)
      }
    });
  }

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
    if (this.companyId &&  this.team && i>-1) {
      this.dataSourceWaitingApp.data.splice(i, 1);
      this.waitingAppTable?.renderRows();
      this.teamService.acceptMember(this.companyId, this.team.id!, usrId);
    }
  }


  rejectMember(usrId: string) {
    let i = this.dataSourceWaitingApp.data.findIndex(e => e.id == usrId);
    if (this.companyId &&  this.team  && i>-1) {
      this.dataSourceWaitingApp.data.splice(i, 1);
      this.waitingAppTable?.renderRows();
      this.teamService.rejectMember(this.companyId, this.team.id!, usrId);
    }
  }

  
  exitTeam(){
    if (this.companyId && this.team && this.user) {
      this.teamService.removeMember(this.companyId, this.team.id!, this.user.id!);
      this.router.navigate(['company/view']);
    }
  }


  //==================
  //   Posts:
  //==================
  toDate(timestamp: Timestamp) {
    return timestamp.toDate().toLocaleString('pt-br');
  }


  getAuthor(id: string): Profile | undefined {
    return this.authors.find(e => e.id == id);
  }


  toggleLike(postId: string){
    this.postService.toggleLike(this.companyId!, postId, this.user?.id!);
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


  onAddPost(){
    this.router.navigate(['post/new'], { 
      state: { 
        teamId: this.team!.id, 
        companyId: this.team!.companyId, 
        usrId: this.user!.id,
        type: 'teamPost'
      } });;
  }

  
}
