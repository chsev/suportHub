import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Team } from 'src/app/shared/models/team.model';
import { UiService } from 'src/app/shared/services/ui.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DeleteTeamComponent } from '../delete-team/delete-team.component';
import { TeamService } from '../services/team.service';
import { User } from 'src/app/shared/models/user.model';
import { AccountService } from 'src/app/account/services/account.service';

@Component({
  selector: 'app-list-team',
  templateUrl: './list-team.component.html',
  styleUrls: ['./list-team.component.css']
})
export class ListTeamComponent implements OnInit, OnDestroy, AfterViewInit {
  displayedColumnsTeams = ['name', 'description', 'nmembers', 'button'];
  dataSourceTeams = new MatTableDataSource<Team>();
  private teamChangedSub: Subscription | undefined;
  private userDataChangedSub: Subscription | undefined;
  private loadingSub: Subscription | undefined;
  user: User | undefined;
  teams: Team[] = [];

  isLoading = false;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  constructor(
    private teamService: TeamService,
    private accountService: AccountService,
    private uiService: UiService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadingSub = this.uiService.loadingStateChanged
      .subscribe(isLoading => this.isLoading = isLoading);

    this.teamChangedSub = this.teamService.teamArrayChanged
      .subscribe((teams: Team[]) => {
        this.teams = teams;
        this.dataSourceTeams.data = teams
      });

    this.userDataChangedSub = this.accountService.userDataChanged
      .subscribe( (userData: User) => {
          this.user = userData;
          if(this.user.companyId){
            this.teamService.fetchTeams(this.user.companyId);
          }
        })

    this.accountService.fetchUserData();
  }

  
  ngAfterViewInit(): void {
    this.dataSourceTeams.sort = this.sort;
    this.dataSourceTeams.paginator = this.paginator;
  }


  ngOnDestroy(): void {
    this.teamChangedSub?.unsubscribe();
    this.loadingSub?.unsubscribe();
    this.userDataChangedSub?.unsubscribe();
  }


  edit(id: string) {
    let t = this.teams.find(e => e.id == id);
    this.router.navigate(['team/edit'], {state: {companyId: t?.companyId, teamId: t?.id}});
  }


  new() {
    this.router.navigate(["team/new"])
  }

  onViewTeam(teamId: string){
    let t = this.teams.find( e => e.id == teamId);
    this.router.navigate(['team/view'], {state: {teamId: t?.id, companyId: t?.companyId}});
  }


  delete(companyId:string, passedId: string, passedName: string) {
    const dialogRef: MatDialogRef<DeleteTeamComponent> = this.dialog
      .open(DeleteTeamComponent, { data: {name: passedName} });
    dialogRef.afterClosed().subscribe(answer => {
      if (answer) {
        this.teamService.remove(companyId, passedId);
      }
    });
  }




}
