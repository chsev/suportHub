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
import { AccountService } from 'src/app/account/services/account.service';
import { Login } from 'src/app/shared/models/login.model';
import { FirebaseApp } from '@angular/fire/app'


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authChange = new Subject<boolean>();
  uidChanged = new Subject<string | undefined>();
  private uid: string | undefined;
  private isAuthenticated = false;


  constructor(
    private fireauth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
    private uiService: UiService,

    private companyService: CompanyService,
    private teamService: TeamService,
    private systemService: SystemService,
    private userService: UserService,
    private accountService: AccountService,
  ) {

  }

  initAuthListener() {
    this.fireauth.authState.subscribe(user => {
      if (user) {
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.accountService.fetchUserData();
        this.router.navigate(['/company']);
      } else {
        this.cancelSubscriptions();
        this.authChange.next(false);
        this.router.navigate(['/login']);
        this.isAuthenticated = false;
      }
    })
  }

  // initUserListener() {
  //   this.fireauth.user.subscribe(user => {
  //     if (user) {
  //       this.uid = user.uid;
  //       this.uidChanged.next(this.uid);
  //     } else {
  //       this.uid = undefined;
  //       this.uidChanged.next(undefined);
  //     }
  //   });
  // }

  isAuth() {
    return this.isAuthenticated;
  }



  registerUser(login: Login, user: User) {
    this.uiService.loadingStateChanged.next(true);
    this.fireauth.createUserWithEmailAndPassword(login.email!, login.password!)
      .then(userCredencials => {
        this.db.collection('users')
          .doc(userCredencials.user?.uid)
          .set(user);
      })
      .catch(error => {
        this.uiService.showSnackbar(error.message, undefined, 10000);
        console.log(error);
      })
      .finally(() => {
        this.uiService.loadingStateChanged.next(false);
      })

  }

  login(login: Login) {
    this.uiService.loadingStateChanged.next(true);
    this.fireauth.signInWithEmailAndPassword(login.email!, login.password!)
      .then(userCredentials => {
        console.log(userCredentials); //test
        console.log(userCredentials.user?.uid); // test
        console.log("---");

        this.accountService.currentUID = userCredentials.user?.uid;
        this.accountService.fetchUserData();
        // this.accountService.fetchUserData(userCredentials.user?.uid!);
      })
      .catch(error => {
        this.uiService.showSnackbar(error.message, undefined, 10000);
      })
      .finally(() => {
        this.uiService.loadingStateChanged.next(false);
      })
  }


  sendPasswordResetEmail(email: string) {
    this.fireauth.sendPasswordResetEmail(email);
  }

  logout() {
    this.fireauth.signOut();
  }

  cancelSubscriptions() {
    this.companyService.cancelSubscriptions();
    this.teamService.cancelSubscriptions();
    this.systemService.cancelSubscriptions();
    this.userService.cancelSubscriptions();
    this.accountService.cancelSubscriptions();
  }

}
