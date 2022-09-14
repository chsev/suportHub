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


  fetchUserData() {
    this.fetchUserID()
      .then((uid) => {
        this.currentUID = uid;
        if (uid) {
          this.fetchCurrentUserDoc();
        }
      });
  }


  private fetchCurrentUserDoc() {
    this.uiService.loadingStateChanged.next(true);
    this.firebaseSubs.push(
      this.db.collection('users').doc<User>(this.currentUID).valueChanges({ idField: 'id' })
        .subscribe({
          next: (doc) => {
            if (doc) {
              this.userDataChanged.next(doc);
              this.uiService.loadingStateChanged.next(false);
            }
          },
          error: () => {
            this.uiService.showSnackbar('Fetching user data failed', undefined, 3000);
            this.uiService.loadingStateChanged.next(false);
          }
        })
    );
  }


  fetchUserDoc(uid: string): Observable<User> {
    return new Observable((observer) => {
      let sub = this.db.collection('users').doc<User>(uid).get()
        .subscribe((doc) => {
          observer.next({ ...doc.data(), id: uid });
          sub.unsubscribe();
        })
    })
  }


  fetchProfile(uid: string): Observable<Profile> {
    this.uiService.loadingStateChanged.next(true);
    return new Observable((observer) => {
      this.db.collection('users').doc<User>(uid).get()
        .subscribe((usrdoc) => {
          let usr: User | undefined = usrdoc.data();
          if (usr) {
            let path = usr.profileImg ? `users/${uid}/profile/${usr.profileImg}` : DEFAULT_profileImgUrl;
            this.storage.ref(path).getDownloadURL()
              .subscribe((url) => {
                this.uiService.loadingStateChanged.next(false);
                observer.next({ ...usr, id: uid, photoUrl: url });
              });
          }
        })
    })
  }


  fetchUserDocList(usersID: string[]): Observable<User[]> {
    return new Observable((observer) => {
      let users: User[] = [];
      usersID.forEach((uid) => {
        let sub = this.db.collection('users').doc<User>(uid).get()
          .subscribe((usrdoc) => {
            let usr: User | undefined = usrdoc.data();
            if (usr) {
              users.push({ ...usr, id: uid });
              observer.next(users);
              sub.unsubscribe();
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

      if(len==0){
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
                      error: () => { count++; }
                    });
              }
            },
            error: () => { count++; }
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
        console.log("user: undefined");
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

  updateUserCompany(newCompanyID: string | undefined, usrId: string) {
    this.db.collection('users').doc(usrId)
      .update({
        company: newCompanyID ?? deleteField()
      })
      .then(() => {
        console.log("Document successfully updated!");
      })
      .catch((error) => {  // The document probably doesn't exist.
        this.uiService.showSnackbar("Error updating document: " + error.toString(), undefined, 3000);
        console.error("Error updating document: ", error);
      })
  }


  updateUserPendingApproval(companyId: string | undefined, usrId: string) {
    this.db.collection('users').doc(usrId)
      .update({
        pendingApproval: companyId ?? deleteField()
      })
      .then(() => {
        console.log("Document successfully updated!");
      })
      .catch((error) => {  // The document probably doesn't exist.
        this.uiService.showSnackbar("Error updating document: " + error.toString(), undefined, 3000);
        console.error("Error updating document: ", error);
      })
  }


  updateProfileImg(usrId: string, filename: string | undefined){
    let usrDocRef = this.db.collection('users').doc(usrId);
    // if(filename){
      usrDocRef.update({
        profileImg: filename ?? deleteField()
      });
      return;
    // }
    // usrDocRef.update({
    //   profileImg: deleteField()
    // });
  }


  cancelSubscriptions() {
    this.firebaseSubs.forEach(sub => sub.unsubscribe());
  }

}
