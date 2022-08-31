import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { System } from 'src/app/shared/models/system.model';
import { UiService } from 'src/app/shared/services/ui.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DeleteSystemComponent } from '../delete-system/delete-system.component';
import { SystemService } from '../services/system.service';
import { User } from 'src/app/shared/models/user.model';
import { AccountService } from 'src/app/account/services/account.service';

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
    private systemService: SystemService,
    private accountService: AccountService,
    private uiService: UiService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadingSub = this.uiService.loadingStateChanged
      .subscribe(isLoading => this.isLoading = isLoading);

      this.systemChangedSub = this.systemService.systemArrayChanged
      .subscribe((systems: System[]) => {
        this.dataSourceSystems.data = systems;
        this.systems = systems;
      })

      this.userDataChangedSub = this.accountService.userDataChanged
      .subscribe( (userData: User) => {
          this.user = userData;
          if(this.user.companyId){
            this.systemService.fetchSystems(this.user.companyId);
          }
        })

    this.accountService.fetchUserData();
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


  onEdit(systemId: string) {
    // this.systemService.editingSystemId = id;
    // this.router.navigate(['system/edit']);

    let s = this.systems.find(e => e.id == systemId);
    this.router.navigate(['system/edit'], {state: {companyId: s?.companyId, systemId: s?.id}});
  }


  onNew() {
    this.router.navigate(["system/new"])
  }

  onViewSystem(systemId: string){
    let s = this.systems.find(e => e.id == systemId);
    this.router.navigate(['system/view'], {state: {companyId: s?.companyId, systemId: s?.id}});
  }


  onDelete(companyId:string, passedId: string, passedName: string) {
    const dialogRef: MatDialogRef<DeleteSystemComponent> = this.dialog.open(DeleteSystemComponent, {
      data: {
        name: passedName
      }
    });
    dialogRef.afterClosed().subscribe(answer => {
      if (answer) {
        this.systemService.remove(companyId, passedId);
      }
    });
  }




}
