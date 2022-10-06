import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Team } from 'src/app/shared/models/team.model';
import { UiService } from 'src/app/shared/services/ui.service';
import { TeamService } from '../services/team.service';
import { User } from 'src/app/shared/models/user.model';
import { AccountService } from 'src/app/account/services/account.service';


@Component({
  selector: 'app-list-team',
  templateUrl: './list-team.component.html',
  styleUrls: ['./list-team.component.css']
})
export class ListTeamComponent implements OnInit, OnDestroy, AfterViewInit {
  displayedColumnsTeams = ['name', 'description', 'nmembers', 'nsystems', 'button'];
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
    private router: Router
  ) { }


  ngOnInit(): void {
    this.loadingSub = this.uiService.loadingStateChanged
      .subscribe(isLoading => this.isLoading = isLoading);

    this.userDataChangedSub = this.accountService.userDataChanged
      .subscribe( (userData: User) => {
          this.user = userData;
          this.fetchCompanyTeams();
        });
    this.accountService.fetchUserData();
  }

  
  private fetchCompanyTeams() {
    if (this.user?.companyId) {
      this.teamService.fetchCompanyTeams(this.user.companyId)
        .subscribe((teams: Team[]) => {
          let userTeams = teams.filter(e => e.members?.includes(this.user?.id!));
          this.teams = userTeams;
          this.dataSourceTeams.data = userTeams;
        });
    }
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


  new() {
    this.router.navigate(["team/new"])
  }


  onViewTeam(teamId: string){
    let t = this.teams.find( e => e.id == teamId);
    this.router.navigate(['team/view'], {state: {teamId: t?.id, companyId: t?.companyId}});
  }

}
