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

@Component({
  selector: 'app-list-system',
  templateUrl: './list-system.component.html',
  styleUrls: ['./list-system.component.css']
})
export class ListSystemComponent implements OnInit, OnDestroy, AfterViewInit {
  displayedColumns = ['name', 'description', 'button'];
  dataSource = new MatTableDataSource<System>();
  private systemChangedSub!: Subscription;

  isLoading = false;
  private loadingSub!: Subscription;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  constructor(
    private systemService: SystemService,
    private uiService: UiService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.systemChangedSub = this.systemService.systemArrayChanged
      .subscribe((systems: System[]) => this.dataSource.data = systems);
    this.loadingSub = this.uiService.loadingStateChanged
      .subscribe(isLoading => this.isLoading = isLoading);
    this.systemService.fetchSystems();
  }

  
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }


  ngOnDestroy(): void {
    this.systemChangedSub.unsubscribe();
    this.loadingSub.unsubscribe();
  }


  edit(id: string) {
    this.systemService.editingSystemId = id;
    this.router.navigate(['system/edit']);
  }


  new() {
    this.router.navigate(["system/new"])
  }


  delete(passedId: string, passedName: string) {
    const dialogRef: MatDialogRef<DeleteSystemComponent> = this.dialog.open(DeleteSystemComponent, {
      data: {
        name: passedName
      }
    });
    dialogRef.afterClosed().subscribe(answer => {
      if (answer) {
        this.systemService.remove(passedId);
      }
    });
  }




}
