import { Injectable } from '@angular/core';
import { User } from 'src/app/shared/models/user.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, Subject } from 'rxjs';
import { UiService } from 'src/app/shared/services/ui.service';
import { Router } from '@angular/router';
import { CompanyService } from 'src/app/company/services/company.service';
import { TeamService } from 'src/app/team/services/team.service';
import { SystemService } from 'src/app/system/services/system.service';
import { AccountService } from 'src/app/account/services/account.service';
import { Login } from 'src/app/shared/models/login.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authChange = new Subject<boolean>();

  constructor(
    private fireauth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
    private uiService: UiService,
    private companyService: CompanyService,
    private teamService: TeamService,
    private systemService: SystemService,
    private accountService: AccountService,
  ) { }


  initAuthListener() {
    this.fireauth.user.subscribe(user => {
      if (user) {
        this.authChange.next(true);
        this.accountService.fetchUserData();
      } else {
        this.cancelSubscriptions();
        this.authChange.next(false);
        this.router.navigate(['/login']);
      }
    })
  }


  isAuth(): Observable<boolean> {
    return new Observable((observer) => {
      this.fireauth.user.subscribe({
        next: (user) => {
          if (user) {
            observer.next(true);
            return;
          }
          observer.next(false);
        },
        error: () => observer.next(false)
      })
    })
  }


  registerUser(login: Login, user: User) {
    this.uiService.loadingStateChanged.next(true);
    this.fireauth.createUserWithEmailAndPassword(login.email!, login.password!)
      .then(userCredencials => {
        this.db.collection('users').doc(userCredencials.user?.uid)
            .set(user);
      })
      .catch(error => {
        this.uiService.showSnackbar(error.message, undefined, 10000);
      })
      .finally(() => {
        this.uiService.loadingStateChanged.next(false);
      })
  }


  login(login: Login) {
    this.uiService.loadingStateChanged.next(true);
    this.fireauth.signInWithEmailAndPassword(login.email!, login.password!)
      .then( () => {
        this.accountService.fetchUserData();
        this.router.navigate(['/welcome']);
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
    this.accountService.cancelSubscriptions();
  }

}
