import { Injectable } from '@angular/core';
import { User } from 'src/app/shared/models/user.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Subject } from 'rxjs';
import { UiService } from 'src/app/shared/services/ui.service';
import { Router } from '@angular/router';
import { CompanyService } from 'src/app/company/services/company.service';
import { TeamService } from 'src/app/team/services/team.service';
import { SystemService } from 'src/app/system/services/system.service';
import { UserService } from 'src/app/user/services/user.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authChange = new Subject<boolean>();
  private isAuthenticated = true;


  constructor(
    private fireauth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
    private uiService: UiService,

    private companyService: CompanyService,
    private teamService: TeamService,
    private systemService: SystemService,
    private userService: UserService
  ) { }

  initAuthListener() {
    this.fireauth.authState.subscribe(user => {
      if (user) {
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(['/welcome']);
      } else {
        this.cancelSubscriptions();
        this.authChange.next(false);
        this.router.navigate(['/login']);
        this.isAuthenticated = false;
      }
    })
  }

  isAuth() {
    return this.isAuthenticated;
  }

  registerUser(user: User) {
    this.uiService.loadingStateChanged.next(true);
    this.fireauth.createUserWithEmailAndPassword(user.email!, user.password!)
      .then(userCredencials => {
        this.db.collection('users').add({
          uid: userCredencials.user?.uid,
          ...user
        });
      })
      .catch(error => {
        this.uiService.showSnackbar(error.message, undefined, 10000);
        console.log(error);
      })
      .finally(() => {
        this.uiService.loadingStateChanged.next(false);
      })
  }

  login(user: User) {
    this.uiService.loadingStateChanged.next(true);
    this.fireauth.signInWithEmailAndPassword(user.email!, user.password!)
      .then(userCredentials => {
        console.log(userCredentials); //test
        console.log(userCredentials.user?.uid) // test
      })
      .catch(error => {
        this.uiService.showSnackbar(error.message, undefined, 10000);
      })
      .finally(() => {
        this.uiService.loadingStateChanged.next(false);
      })
  }


  logout() {
    this.fireauth.signOut();
  }

  cancelSubscriptions() {
    this.companyService.cancelSubscriptions();
    this.teamService.cancelSubscriptions();
    this.systemService.cancelSubscriptions();
    this.userService.cancelSubscriptions();
  }

}
