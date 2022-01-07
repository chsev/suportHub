import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Company } from 'src/app/shared/models/company.model';
import { UiService } from 'src/app/shared/services/ui.service';
import { CompanyService } from '../services/company.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DeleteCompanyComponent } from '../delete-company/delete-company.component';

@Component({
  selector: 'app-list-company',
  templateUrl: './list-company.component.html',
  styleUrls: ['./list-company.component.css']
})
export class ListCompanyComponent implements OnInit, OnDestroy, AfterViewInit {
  displayedColumns = ['name', 'segment', 'administrator', 'isOpen', 'button'];
  dataSource = new MatTableDataSource<Company>();
  private companyChangedSub!: Subscription;

  isLoading = false;
  private loadingSub!: Subscription;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  constructor(
    private companyService: CompanyService,
    private uiService: UiService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.companyChangedSub = this.companyService.companyArrayChanged
      .subscribe((companies: Company[]) => this.dataSource.data = companies);
    this.loadingSub = this.uiService.loadingStateChanged
      .subscribe(isLoading => this.isLoading = isLoading);
    this.companyService.fetchCompanies();
  }

  
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }


  ngOnDestroy(): void {
    this.companyChangedSub.unsubscribe();
    this.loadingSub.unsubscribe();
  }


  edit(id: string) {
    this.companyService.editingCompanyId = id;
    this.router.navigate(['company/edit']);
  }


  new() {
    this.router.navigate(["company/new"])
  }


  delete(passedId: string, passedName: string) {
    const dialogRef: MatDialogRef<DeleteCompanyComponent> = this.dialog.open(DeleteCompanyComponent, {
      data: {
        name: passedName
      }
    });
    dialogRef.afterClosed().subscribe(answer => {
      if (answer) {
        this.companyService.remove(passedId);
      }
    });
  }




}
