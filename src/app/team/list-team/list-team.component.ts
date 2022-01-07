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

@Component({
  selector: 'app-list-team',
  templateUrl: './list-team.component.html',
  styleUrls: ['./list-team.component.css']
})
export class ListTeamComponent implements OnInit, OnDestroy, AfterViewInit {
  displayedColumns = ['name', 'description', 'button'];
  dataSource = new MatTableDataSource<Team>();
  private teamChangedSub!: Subscription;

  isLoading = false;
  private loadingSub!: Subscription;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  constructor(
    private teamService: TeamService,
    private uiService: UiService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.teamChangedSub = this.teamService.teamArrayChanged
      .subscribe((teams: Team[]) => this.dataSource.data = teams);
    this.loadingSub = this.uiService.loadingStateChanged
      .subscribe(isLoading => this.isLoading = isLoading);
    this.teamService.fetchTeams();
  }

  
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }


  ngOnDestroy(): void {
    this.teamChangedSub.unsubscribe();
    this.loadingSub.unsubscribe();
  }


  edit(id: string) {
    this.teamService.editingTeamId = id;
    this.router.navigate(['team/edit']);
  }


  new() {
    this.router.navigate(["team/new"])
  }


  delete(passedId: string, passedName: string) {
    const dialogRef: MatDialogRef<DeleteTeamComponent> = this.dialog.open(DeleteTeamComponent, {
      data: {
        name: passedName
      }
    });
    dialogRef.afterClosed().subscribe(answer => {
      if (answer) {
        this.teamService.remove(passedId);
      }
    });
  }




}
