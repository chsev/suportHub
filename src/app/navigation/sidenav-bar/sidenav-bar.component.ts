import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/account/services/account.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Profile } from 'src/app/shared/models/profile.model';

@Component({
  selector: 'app-sidenav-bar',
  templateUrl: './sidenav-bar.component.html',
  styleUrls: ['./sidenav-bar.component.css']
})
export class SidenavBarComponent implements OnInit, OnDestroy {
  @Output() closeSidenav = new EventEmitter<void>();
  isAuth = false;
  authSubscription!: Subscription;
  profile: Profile | undefined;
  private userDataChangedSub: Subscription | undefined;

  constructor(
    private authService: AuthService,
    private accountService: AccountService
  ) { }


  ngOnInit(): void {
    this.authSubscription = this.authService.authChange
      .subscribe(authStatus => this.isAuth = authStatus)

    this.userDataChangedSub = this.accountService.userDataChanged
      .subscribe( (userData) => this.getProfile(userData.id!) )
  }


  getProfile(usrId: string | undefined) {
    if(usrId){
      this.accountService.fetchProfile(usrId)
      .subscribe((profile) => this.profile = profile)
    }
  }


  onClose() {
    this.closeSidenav.emit();
  }


  onLogout() {
    this.closeSidenav.emit();
    this.authService.logout();
  }


  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }
}
