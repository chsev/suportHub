import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/shared/models/user.model';
import { UiService } from 'src/app/shared/services/ui.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DeleteUserComponent } from '../delete-user/delete-user.component';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css']
})
export class ListUserComponent implements OnInit, OnDestroy, AfterViewInit {
  displayedColumns = ['email', 'name', 'position', 'uid', 'button'];
  dataSource = new MatTableDataSource<User>();
  private userChangedSub!: Subscription;

  isLoading = false;
  private loadingSub!: Subscription;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  constructor(
    private userService: UserService,
    private uiService: UiService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.userChangedSub = this.userService.userArrayChanged
      .subscribe((users: User[]) => this.dataSource.data = users);
    this.loadingSub = this.uiService.loadingStateChanged
      .subscribe(isLoading => this.isLoading = isLoading);
    this.userService.fetchUsers();
  }

  
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }


  ngOnDestroy(): void {
    this.userChangedSub.unsubscribe();
    this.loadingSub.unsubscribe();
  }


  edit(id: string) {
    this.userService.editingUserId = id;
    this.router.navigate(['user/edit']);
  }


  // new() {
  //   this.router.navigate(["user/new"])
  // }


  delete(passedId: string, passedName: string) {
    const dialogRef: MatDialogRef<DeleteUserComponent> = this.dialog.open(DeleteUserComponent, {
      data: {
        name: passedName
      }
    });
    dialogRef.afterClosed().subscribe(answer => {
      if (answer) {
        this.userService.remove(passedId);
      }
    });
  }




}
