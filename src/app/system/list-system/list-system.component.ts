import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { System } from 'src/app/shared/models/system.model';
import { UiService } from 'src/app/shared/services/ui.service';
import { SystemService } from '../services/system.service';
import { User } from 'src/app/shared/models/user.model';
import { AccountService } from 'src/app/account/services/account.service';
import { TeamService } from 'src/app/team/services/team.service';


@Component({
  selector: 'app-list-system',
  templateUrl: './list-system.component.html',
  styleUrls: ['./list-system.component.css']
})
export class ListSystemComponent implements OnInit, OnDestroy, AfterViewInit {
  displayedColumnsSystems = ['name', 'description', 'ndocs' ,'button'];
  dataSourceSystems= new MatTableDataSource<System>();
  private systemChangedSub: Subscription | undefined;
  private userDataChangedSub: Subscription | undefined;
  private loadingSub!: Subscription;
  user: User | undefined;
  systems: System[] = [];

  isLoading = false;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  
  constructor(
    private accountService: AccountService,
    private teamService: TeamService,
    private systemService: SystemService,
    private uiService: UiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadingSub = this.uiService.loadingStateChanged
      .subscribe(isLoading => this.isLoading = isLoading);

      this.userDataChangedSub = this.accountService.userDataChanged
      .subscribe( (userData: User) => {
          this.user = userData;
          this.getUserTeams(userData);
        })

    this.accountService.fetchUserData();
  }

  
  private getUserTeams(usr: User) {
    if( usr.companyId && usr.id){
      this.teamService.fetchUserTeams(usr.companyId, usr.id)
        .subscribe( (teams) => {
          let usrSystems: string[] = [];
          teams.forEach( e => e.systems ? usrSystems.push(...e.systems) : '');
          this.getSystems(usr, usrSystems);
        })
    }
  }


  private getSystems(usr: User, usrSystems: string[]) {
    if(usr.companyId){
      this.systemService.getSystemList(usr.companyId, usrSystems)
      .subscribe( (systems: System[]) => {
        this.dataSourceSystems.data = systems;
        this.systems = systems;
      });
    }
  }


  ngAfterViewInit(): void {
    this.dataSourceSystems.sort = this.sort;
    this.dataSourceSystems.paginator = this.paginator;
  }


  ngOnDestroy(): void {
    this.systemChangedSub?.unsubscribe();
    this.loadingSub?.unsubscribe();
    this.userDataChangedSub?.unsubscribe();
  }


  onViewSystem(systemId: string){
    let s = this.systems.find(e => e.id == systemId);
    this.router.navigate(['system/view'], {state: {companyId: s?.companyId, systemId: s?.id}});
  }

}
