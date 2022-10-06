import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Timestamp } from 'firebase/firestore';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/account/services/account.service';
import { Company } from 'src/app/shared/models/company.model';
import { Invitation } from 'src/app/shared/models/invitation.model';
import { User } from 'src/app/shared/models/user.model';
import { UiService } from 'src/app/shared/services/ui.service';
import { CompanyService } from '../services/company.service';


@Component({
  selector: 'app-welcome-company',
  templateUrl: './welcome-company.component.html',
  styleUrls: ['./welcome-company.component.css']
})
export class WelcomeCompanyComponent implements OnInit {
  private userDataChangedSub!: Subscription;
  private loadingSub!: Subscription;
  user: User | undefined;
  isLoading = false;
  pendingCompany: Company | undefined;

  invitations: Invitation[] = [];
  companies: Company[] = [];
  

  constructor(
    private router: Router,
    private accountService: AccountService,
    private uiService: UiService,
    private companyService: CompanyService,
  ) { }


  ngOnInit(): void {
    this.loadingSub = this.uiService.loadingStateChanged
      .subscribe(isLoading => this.isLoading = isLoading);

    this.userDataChangedSub = this.accountService.userDataChanged
      .subscribe( (userData: User) => {
        this.user = userData;
          this.redirectToCompany(userData);
          this.getPendingCompany(userData);
          this.getInvitations(userData);
        }
      )
    this.accountService.fetchUserData();
  }


  ngOnDestroy(): void {
    this.loadingSub?.unsubscribe();
    this.userDataChangedSub?.unsubscribe();
  }


  private getInvitations(userData: User){
    if (userData.email){
      this.companyService.fetchInvitations(userData.email)
      .subscribe( (invites) => {
          this.invitations = invites;
          this.fetchCompanyList(invites)
        })
    }
  }


  getCompanyName(companyId: string): string{
    let idx = this.companies.findIndex(e => e.id === companyId);
    return (idx != -1)? this.companies[idx].name! : '';
  }


  toDate(timestamp: Timestamp): string {
    if(!timestamp){
      return '';
    }
    return timestamp.toDate().toLocaleString('pt-br');
  }


  private fetchCompanyList(invites: Invitation[]){
    let companyIds = invites.map(e => e.companyId);
    this.companyService.fetchCompanyList(companyIds).subscribe(
      (companies) => this.companies = companies
    )
  }

  private redirectToCompany(userData: User) {
    if (userData.companyId) {
      this.router.navigate(['company/view']);
    }
  }


  private getPendingCompany(userData: User) {
    if (userData.pendingApproval) {
      this.companyService.fetchCompanyDoc(userData.pendingApproval)
        .subscribe((companyDoc) => this.pendingCompany = companyDoc);
    }
  }

  
  refuseInvite(invite: Invitation){
    this.companyService.refuseInvite(invite.id!)
  }


  acceptInvite(invite: Invitation){
    if(this.user){
      this.companyService.acceptInvite(invite, this.user.id!)
    }
  }
  

  onCreateCompany() {
    this.router.navigate(['company/new']);
  }

  onSearchCompany() {
    this.router.navigate(['company/list']);
  }

  onViewCompany() {
    this.router.navigate(['company/view']);
  }

  onCancelRequest(){
    if(this.pendingCompany && this.user){
      this.companyService.removeFromWaiting(this.pendingCompany.id!, this.user.id!)
    }
  }
}
