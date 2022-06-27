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
import { JoinOpenCompanyComponent } from './joinOpen-company/joinOpen-company.component';
import { JoinClosedCompanyComponent } from './joinClosed-company/joinClosed-company.component';
import { AccountService } from 'src/app/account/services/account.service';

@Component({
  selector: 'app-list-company',
  templateUrl: './list-company.component.html',
  styleUrls: ['./list-company.component.css']
})
export class ListCompanyComponent implements OnInit, OnDestroy, AfterViewInit {
  displayedColumns = ['name', 'segment', 'nMembers', 'isOpen', 'button'];
  dataSource = new MatTableDataSource<Company>();
  private companyChangedSub!: Subscription;

  isLoading = false;
  private loadingSub!: Subscription;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  constructor(
    private companyService: CompanyService,
    private uiService: UiService,
    private accountService: AccountService,
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  join(id: string){
    let company = this.dataSource.data.find(c => c.id == id);
    if(company){
      if(company.isOpen){
        this.joinOpen(company);
      }
      else{
        this.joinClosed(company);
      }
    }
  }

  joinOpen(company: Company){
    const dialogRef: MatDialogRef<JoinOpenCompanyComponent> = this.dialog.open(JoinOpenCompanyComponent, {
      data: { name: company.name }
    });

    dialogRef.afterClosed().subscribe(answer => {
      if (answer) {
        console.log("Aceitou Open");
        this.accountService.updateCompany(company.id!);
        this.companyService.addMember(company.id!, this.accountService.getUserID()!)
      }
    });
  }

  joinClosed(company: Company){
    const dialogRef: MatDialogRef<JoinClosedCompanyComponent> = this.dialog.open(JoinClosedCompanyComponent, {
      data: { name: company.name }
    });

    dialogRef.afterClosed().subscribe(answer => {
      if (answer) {
        console.log("Aceitou Closed");
        this.accountService.updateCompany(company.id!);
        this.companyService.addMember(company.id!, this.accountService.getUserID()!)
      }
    });
  }


  // edit(id: string) {
  //   this.companyService.editingCompanyId = id;
  //   this.router.navigate(['company/edit']);
  // }


  // new() {
  //   this.router.navigate(["company/new"])
  // }


  // delete(passedId: string, passedName: string) {
  //   const dialogRef: MatDialogRef<DeleteCompanyComponent> = this.dialog.open(DeleteCompanyComponent, {
  //     data: {
  //       name: passedName
  //     }
  //   });
  //   dialogRef.afterClosed().subscribe(answer => {
  //     if (answer) {
  //       this.companyService.remove(passedId);
  //     }
  //   });
  // }




}
