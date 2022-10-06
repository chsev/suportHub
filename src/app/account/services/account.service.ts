import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, Subject, Subscription } from 'rxjs';
import { Profile } from 'src/app/shared/models/profile.model';
import { User } from 'src/app/shared/models/user.model';
import { UiService } from 'src/app/shared/services/ui.service';
import { deleteField } from '@angular/fire/firestore';


const DEFAULT_profileImgUrl = "users/default/profile/profile.png";
//asset from https://www.flaticon.com/free-icon/user_1077012?related_id=1077114


@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private currentUID: string | undefined;
  userDataChanged = new Subject<User>();
  private firebaseSubs: Subscription[] = [];

  constructor(
    private uiService: UiService,
    private db: AngularFirestore,
    private fireauth: AngularFireAuth,
    private storage: AngularFireStorage,
  ) { }


  fetchUserData(): void {
    this.fetchUserID()
      .then((uid) => {
        this.currentUID = uid;
        if (uid) {
          this.fetchCurrentUserDoc();
        }
      });
  }


  private fetchCurrentUserDoc() {
    this.firebaseSubs.push(
      this.db.collection('users').doc<User>(this.currentUID).valueChanges({ idField: 'id' })
        .subscribe({
          next: (doc) => {
            if (doc) {
              this.userDataChanged.next(doc);
            }
          },
          error: () => this.uiService.showSnackbar('Fetching user data failed', undefined, 3000)
        })
    );
  }


  getUserDoc(uid: string): Observable<User> {
    return new Observable((observer) => {
      this.db.collection('users').doc<User>(uid).get()
        .subscribe(
          (doc) => observer.next({ ...doc.data(), id: uid })
        )
    })
  }


  fetchProfile(uid: string): Observable<Profile> {
    return new Observable((observer) => {
      this.db.collection('users').doc<User>(uid).get()
        .subscribe((usrdoc) => {
          let usr: User | undefined = usrdoc.data();
          if (usr) {
            let path = usr.profileImg ? `users/${uid}/profile/${usr.profileImg}` : DEFAULT_profileImgUrl;
            this.storage.ref(path).getDownloadURL()
              .subscribe((url) => {
                observer.next({ ...usr, id: uid, photoUrl: url });
              });
          }
        })
    })
  }


  fetchUserList(usersID: string[]): Observable<User[]> {
    return new Observable((observer) => {
      let users: User[] = [];
      usersID.forEach((uid) => {
        this.db.collection('users').doc<User>(uid).get()
          .subscribe((usrdoc) => {
            let usr: User | undefined = usrdoc.data();
            if (usr) {
              users.push({ ...usr, id: uid });
              observer.next(users);
            }
          })
      })
    })
  }


  fetchProfileList(usersID: string[]): Observable<Profile[]> {
    return new Observable((observer) => {
      let len = usersID.length;
      let count = 0
      let profiles: Profile[] = [];

      if (len == 0) {
        observer.next([]);
        return;
      }

      usersID.forEach((uid) => {
        this.db.collection('users').doc<User>(uid).get()
          .subscribe({
            next: (usrdoc) => {
              let usr: User | undefined = usrdoc.data();
              if (usr) {
                let path = usr.profileImg ? `users/${uid}/profile/${usr.profileImg}` : DEFAULT_profileImgUrl;
                this.storage.ref(path).getDownloadURL()
                  .subscribe({
                    next: (url) => {
                      profiles.push({ ...usr, id: uid, photoUrl: url });
                      count++;
                      if (count == len) {
                        observer.next(profiles);
                      }
                    },
                    error: () => {
                      count++;
                      if (count == len) {
                        observer.next(profiles);
                      }
                    }
                  });
              }
            },
            error: () => {
              count++;
              if (count == len) {
                observer.next(profiles);
              }
            }
          });
      });
    });
  }


  private async fetchUserID(): Promise<string | undefined> {
    return this.fireauth.currentUser
      .then(user => {
        if (user) {
          return user.uid;
        }
        return undefined;
      })
      .catch((err) => {
        this.uiService.showSnackbar(err, undefined, 3000);
        return undefined;
      });
  }


  updateUserPosition(newPosition: string) {
    this.db.collection('users').doc(this.currentUID)
      .update({
        position: newPosition
      })
      .then(() => {
        // console.log("Document successfully updated!");
      })
      .catch((error) => { // The document probably doesn't exist.
        this.uiService.showSnackbar("Error updating document: " + error.toString(), undefined, 3000);
      })
  }


  updateUserCompany(newCompanyID: string | undefined, usrId: string) {
    this.db.collection('users').doc(usrId)
      .update({
        companyId: newCompanyID ?? deleteField()
      })
      .then(() => {
        // console.log("Document successfully updated!");
      })
      .catch((error) => {  // The document probably doesn't exist.
        this.uiService.showSnackbar("Error updating document: " + error.toString(), undefined, 3000);
      })
  }


  updatePendingApproval(companyId: string | undefined, usrId: string) {
    this.db.collection('users').doc(usrId)
      .update({
        pendingApproval: companyId ?? deleteField()
      })
      .then(() => {
        // console.log("Document successfully updated!");
      })
      .catch((error) => {  // The document probably doesn't exist.
        this.uiService.showSnackbar("Error updating document: " + error.toString(), undefined, 3000);
      })
  }


  updateProfileImg(usrId: string, filename: string | undefined) {
    let usrDocRef = this.db.collection('users').doc(usrId);
    usrDocRef.update({
      profileImg: filename ?? deleteField()
    });
  }


  cancelSubscriptions() {
    this.firebaseSubs.forEach(sub => sub.unsubscribe());
  }

}
