import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Team } from 'src/app/shared/models/team.model';
import { Location } from '@angular/common';
import { TeamService } from '../services/team.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/shared/models/user.model';
import { AccountService } from 'src/app/account/services/account.service';
import { Observable, Subscription } from 'rxjs';
import { UiService } from 'src/app/shared/services/ui.service';
import { Router } from '@angular/router';
import { System } from 'src/app/shared/models/system.model';
import { SystemService } from 'src/app/system/services/system.service';
import { MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { Post } from 'src/app/shared/models/post.model';
import { arrayRemove } from 'firebase/firestore';
import { Profile } from 'src/app/shared/models/profile.model';

const mockposts: Post[] = [
  {
    id: 'id1', usrId: '44dvYb0VdnfyRXBdXrtED7afFAp1', title: 'Como Resolver Problema', type: 'teamPost', teamId: 'tiddalskdjlaskd',
    created: '2022-08-08T13:56:01.442Z', liked: [], viewed: []
  },

  {
    id: 'id2', usrId: '44dvYb0VdnfyRXBdXrtED7afFAp1', title: 'Como Identificar Problema', type: 'teamPost', teamId: 'tiddalskdjlaskd',
    created: '2022-08-07T13:56:01.442Z', liked: [], viewed: []
  },

  {
    id: 'id3', usrId: '44dvYb0VdnfyRXBdXrtED7afFAp1', title: 'Como Causar Problema', type: 'teamPost', teamId: 'tiddalskdjlaskd',
    created: '2022-08-06T13:56:01.442Z', liked: [], viewed: []
  },
];


export interface FlaggedUser extends User {
  isAdmin?: boolean;
}


@Component({
  selector: 'app-view-team',
  templateUrl: './view-team.component.html',
  styleUrls: ['./view-team.component.css']
})
export class ViewTeamComponent implements OnInit {
  team: Team | undefined;
  user: User | undefined;
  userIsAdmin = true;
  isLoading = false;
  showTeamCardContent = false;

  displayedColumnsMembers = ['name', 'email', 'position', 'expand'];
  dataSourceMembers = new MatTableDataSource<User>([]);
  @ViewChild('members') membersTable: MatTable<User> | undefined;

  displayedColumnsSystems = ['name', 'description', 'action'];
  dataSourceSystems = new MatTableDataSource<System>([]);
  @ViewChild('systems') systemsTable: MatTable<System> | undefined;

  posts: Post[] = [];
  authors: Profile[] = [];

  private teamSub: Subscription | undefined;
  private membersSub: Subscription | undefined;
  private loadingSub: Subscription | undefined;
  private userDataChangedSub: Subscription | undefined;

  constructor(
    private uiService: UiService,
    private router: Router,
    private location: Location,
    private teamService: TeamService,
    private accountService: AccountService,
    private systemService: SystemService,
    private _bottomSheet: MatBottomSheet,
    // private storage: AngularFireStorage,
  ) { }


  ngOnInit(): void {
    this.loadingSub = this.uiService.loadingStateChanged
      .subscribe(isLoading => this.isLoading = isLoading);

    let state: any = this.location.getState();
    this.getUser();
    this.getTeamData(state);
    this.getPosts();
  }


  ngOnDestroy(): void {
    this.teamSub?.unsubscribe();
    this.membersSub?.unsubscribe();
    this.loadingSub?.unsubscribe();
    this.userDataChangedSub?.unsubscribe();
  }


  getPosts() {
    this.posts = mockposts;

    let authorsIds = [...new Set( this.posts.map(e => e.usrId) )]
    this.accountService.fetchProfileList(authorsIds)
      .subscribe( (profiles) => {
        this.authors = profiles;
    })
  }

  getAuthor(id: string): Profile | undefined {
    return this.authors.find(e => e.id == id);
  }


  private getTeamData(state: any) {
    this.teamSub = this.teamService.fetchTeamDoc(state.companyId, state.teamId)
      .subscribe((teamData: Team) => {
        this.team = teamData;
        if (this.team.members) {
          this.getMembersData(this.team.members);
        }
        if (this.team.systems) {
          this.getSystemsData(this.team.systems);
        }
      });
  }


  private getUser() {
    this.userDataChangedSub = this.accountService.userDataChanged
      .subscribe((userData: User) => {
        this.user = userData;
      });
    this.accountService.fetchUserData();
  }


  private getMembersData(membersIds: string[]): void {
    this.membersSub = this.accountService.fetchUserDocList(membersIds)
      .subscribe((usersList) => {
        if (usersList) {
          this.dataSourceMembers.data = usersList.map(usr => this.toUserFlaged(usr));
          this.membersTable!.renderRows();
        }
      });
  }

  private getSystemsData(systemsIds: string[]): void {
    this.systemService.fetchSystemDocList(this.team?.companyId!, systemsIds)
      .subscribe((systemsList) => {
        this.dataSourceSystems.data = systemsList;
        this.systemsTable?.renderRows();
      })
  }


  onEdit() {
    if (this.team) {
      this.router.navigate(['team/edit'], { state: { companyId: this.team.companyId, teamId: this.team.id } });
    }
  }


  private toUserFlaged(user: User): FlaggedUser {
    let adminFlag: boolean = this.team?.administrators?.includes(user.id!) ? true : false;
    return { ...user, isAdmin: adminFlag };
  }


  onAddSystem() {
    this.router.navigate(['system/new'], { state: { teamId: this.team?.id, companyId: this.team?.companyId } });
  }


  onViewSystem(systemId: string) {
    let s = this.dataSourceSystems.data.find(e => e.id == systemId);
    this.router.navigate(['system/view'], { state: { companyId: s?.companyId, systemId: s?.id } });
  }


  openBottomSheet(userId: string): void {
    let usr = this.dataSourceMembers.data.find(e => e.id == userId);
    this._bottomSheet.open(BottomSheetMembersOptionsTeam, {
      data: { name: usr?.name, email: usr?.email, isAdmin: true }
    });
  }


  toDate(timestamp: string) {
    return timestamp.substring(0, 19).replace('T', ' ');
  }


  toggleLike(postId: string) {
    let postIndex = this.posts.findIndex(e => e.id == postId);
    if (postIndex != -1) {
      if (this.posts[postIndex].liked.includes(this.user?.id!)) {
        this.removeLike(postIndex);
        return;
      }
      this.addLike(postIndex);
    }
  }

  private addLike(postIndex: number): void {
    this.posts[postIndex].liked.push(this.user?.id!);
  }

  private removeLike(postIndex: number) {
    let i = this.posts[postIndex].liked.indexOf(this.user?.id!);
    if (i > -1) {
      this.posts[postIndex].liked.splice(i, 1);
    }
  }


  userViewed(postId: string): boolean {
    let i = this.posts.findIndex(e => e.id == postId);
    if (i > -1 && this.posts[i].viewed.includes(this.user?.id!)) {
      return true;
    }
    return false;
  }


  viewPost(postId: string) {
    this.router.navigate(['post/view']);
  }

}




@Component({
  selector: 'bottom-sheet-members-options-team',
  templateUrl: 'bottom-sheet-members-options-team.html',
})
export class BottomSheetMembersOptionsTeam {
  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private _bottomSheetRef: MatBottomSheetRef<BottomSheetMembersOptionsTeam>
  ) { }

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
