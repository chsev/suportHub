import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, Subject, Subscription } from 'rxjs';
import { User } from 'src/app/shared/models/user.model';
import { UiService } from 'src/app/shared/services/ui.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  currentUser: User | undefined;
  currentUID: string | undefined;
  userDataChanged = new Subject<User>();
  private firebaseSubs: Subscription[] = [];

  constructor(
    private uiService: UiService,
    private db: AngularFirestore,
    private fireauth: AngularFireAuth,
  ) { }


  fetchUserData() {
    this.uiService.loadingStateChanged.next(true);

    if (this.currentUID) {
      // console.log("currentUID: " + this.currentUID);
      this.fetchCurrentUserDoc();
    }
    else {
      this.fetchUSerID()
        .then((uid) => {
          // console.log("uid: " + uid);
          this.currentUID = uid;
          this.fetchCurrentUserDoc();
        })
    }
  }


  private fetchCurrentUserDoc() {
    this.firebaseSubs.push(
      this.db.collection('users').doc<User>(this.currentUID).valueChanges()
        .subscribe(
          (doc) => {
            // console.log("doc:");
            // console.log(doc);
            this.currentUser = doc as User;
            this.userDataChanged.next(this.currentUser);
            this.uiService.loadingStateChanged.next(false);
          },
          error => {
            this.uiService.showSnackbar('Fetching user data failed', undefined, 3000);
            this.uiService.loadingStateChanged.next(false);
          }
        )
    );
  }


  fetchUserDocList(usersID: string[]): Observable<User[]> {
    return new Observable((observer) => {
      let users: User[] = [];
      usersID.forEach((uid) => {
        this.db.collection('users').doc<User>(uid).get()
          .subscribe( (doc) => {
              if(doc.data()?.name){
                users.push({...doc.data()!, id: uid});
                observer.next(users);
              }
            })
      })
    })
  }

  fetchUserDoc(uid: string): Observable<User> {
    return new Observable((observer) => {

        this.db.collection('users').doc<User>(uid).get()
          .subscribe( (doc) => {
                observer.next({...doc.data(), id: uid});
              })
            })
          }



  private async fetchUSerID(): Promise<string | undefined> {
    return this.fireauth.currentUser
      .then(user => {
        if (user) {
          console.log("achei user");
          return user.uid;
        }
        console.log("user undefined");
        return undefined;
      })
      .catch((err) => {
        console.log(err);
        return undefined;
      });
  }


  updateUserPosition(newPosition: string) {
    this.db.collection('users').doc(this.currentUID)
      .update({
        position: newPosition
      })
      .then(() => {
        console.log("Document successfully updated!");
      })
      .catch((error) => { // The document probably doesn't exist.
        this.uiService.showSnackbar("Error updating document: " + error.toString(), undefined, 3000);
        console.error("Error updating document: ", error);
      })
  }

  updateCompany(newCompanyID: string) {
    this.db.collection('users').doc(this.currentUID)
      .update({
        company: newCompanyID
      })
      .then(() => {
        console.log("Document successfully updated!");
      })
      .catch((error) => {  // The document probably doesn't exist.
        this.uiService.showSnackbar("Error updating document: " + error.toString(), undefined, 3000);
        console.error("Error updating document: ", error);
      })
  }


  getUserID(): string | undefined {
    return this.currentUID;
  }


  getUser(): User | undefined {
    return this.currentUser;
  }


  cancelSubscriptions() {
    this.firebaseSubs.forEach(sub => sub.unsubscribe());
  }

}
