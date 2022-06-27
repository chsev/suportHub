import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/account/services/account.service';
import { Company } from 'src/app/shared/models/company.model';
import { System } from 'src/app/shared/models/system.model';
import { Team } from 'src/app/shared/models/team.model';
import { User } from 'src/app/shared/models/user.model';
import { CompanyService } from '../services/company.service';
import {MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

export interface UserFlaged extends User {
  isAdmin?: boolean;
}


const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

var t1: Team = {id: "9du21hdu", name: "Projetos", description: "uma equipe de projetos"};
var t2: Team = {id: "ndoidhd3", name: "Implantação", description: "uma equipe de implantação"};
var t3: Team = {id: "dn9213d9", name: "Comercial", description: "uma equipe comercial"};

@Component({
  selector: 'app-view-company',
  templateUrl: './view-company.component.html',
  styleUrls: ['./view-company.component.css']
})
export class ViewCompanyComponent implements OnInit {

  members: UserFlaged[] = []; //[ { "position": "office-boy executivo", "email": "gelokod354@krunsea.com", "name": "Geloko", "company": "3laONkzasAqeZrQwTlFw" }, { "position": "Admin", "name": "Carlos", "email": "chsev@test.com" } ];
  membersColumns: string[] = ['name', 'email', 'position', 'expand'];

  teams: Team[] = [t1, t2, t3];
  systems: System[] = [];

  user: User | undefined;
  company: Company | undefined;
  showCompanyCardContent = false;
  private userDataChangedSub!: Subscription;

  isLoading = false;
  userIsAdmin = false;

  //test:
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;

  @ViewChild(MatTable) table: MatTable<User> | undefined;

  constructor(
    private companyService: CompanyService,
    private accountService: AccountService,
    private router: Router,
    private _bottomSheet: MatBottomSheet
  ) { }


  toUserFlaged(user: User): UserFlaged {
    let adminFlag: boolean = this.company?.administrator == user.id;
    return { ...user, isAdmin: adminFlag }
  }


  ngOnInit(): void {
    this.getUser();
  }


  private getUser() {
    this.userDataChangedSub = this.accountService.userDataChanged
      .subscribe(
        (userData: User) => {
          this.user = userData;
          this.fetchCompanyData(userData.companyId);
        }
      );
    this.accountService.fetchUserData();
  }


  private fetchCompanyData(companyID: string | undefined) {
    if (companyID) {
      this.companyService.fetchCompanyDoc(companyID)
        .subscribe((data) => {
          if (data) {
            this.company = data;
            if(this.company.administrator == this.user?.id){
              this.userIsAdmin = true;
            }
            this.getMembersData();
          }
        });
    }
  }


  private getMembersData() {
    this.accountService
      .fetchUserDocList(['44dvYb0VdnfyRXBdXrtED7afFAp1', 'HJhHgF2trIOv3UUUfJYnzlCas6w2', 'v4yisPjzS5VTrzrjl6QX6pTKdSi2'])
      .subscribe(
        (list) => {
          if (list) {
            this.members = list.map(value => this.toUserFlaged(value));
            this.table!.renderRows();
          }
        }
      );
  }


  ngOnDestroy(): void {
    if (this.userDataChangedSub) {
      this.userDataChangedSub.unsubscribe();
    }
  }

  onViewTeam(teamId: string){
    
  }

  onEdit() {
    if (this.company?.id) {
      // this.companyService.editingCompanyId = this.company.id;
      this.router.navigate(['company/edit'], {queryParams: {id: this.company.id}});
    }
  }

  openBottomSheet(): void {
    this._bottomSheet.open(BottomSheetOverviewMembersOptions, {
      data: {names: ['Frodo', 'Bilbo']}
    });
  }

}


@Component({
  selector: 'bottom-sheet-members-options',
  templateUrl: 'bottom-sheet-members-options.html',
})
export class BottomSheetOverviewMembersOptions {
  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private _bottomSheetRef: MatBottomSheetRef<BottomSheetOverviewMembersOptions>
    ) {}

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
}