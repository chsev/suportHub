import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/account/services/account.service';
import { User } from 'src/app/shared/models/user.model';
import { UiService } from 'src/app/shared/services/ui.service';

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


  constructor(
    private router: Router,
    private accountService: AccountService,
    private uiService: UiService,
  ) { }

  ngOnInit(): void {

    this.loadingSub = this.uiService.loadingStateChanged
      .subscribe(isLoading => this.isLoading = isLoading);

    this.userDataChangedSub = this.accountService.userDataChanged
      .subscribe(
        (userData: User) => this.user = userData
      )

    this.accountService.fetchUserData();
  }

  ngOnDestroy(): void {
    this.loadingSub.unsubscribe();
    this.userDataChangedSub.unsubscribe();
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
}
