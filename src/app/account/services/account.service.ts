import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Subject, Subscription } from 'rxjs';
import { User } from 'src/app/shared/models/user.model';
import { UiService } from 'src/app/shared/services/ui.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  currentUser: User | undefined;
  currentUID: string | undefined;
  private firebaseSubs: Subscription[] = [];
  userDataChanged = new Subject<User>();

  constructor(
    private db: AngularFirestore,
    private uiService: UiService,
    private fireauth: AngularFireAuth,
  ) { }


  fetchUserData() {
    this.uiService.loadingStateChanged.next(true);

    if (this.currentUID) {
      console.log("currentUID: " + this.currentUID);
      this.fetchDatabase();
    }
    else {
      this.fetchUSerID()
        .then((uid) => {
          console.log("uid: " + uid);
          this.currentUID = uid;
          this.fetchDatabase();
        })
    }
  }


  private fetchDatabase() {
    this.firebaseSubs.push(
      this.db.collection('users').doc<User>(this.currentUID).valueChanges()
        .subscribe(
          (doc) => {
            console.log("doc:");
            console.log(doc);
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


  private fetchUSerID(): Promise<string | undefined> {
    return this.fireauth.currentUser
      .then(user => {
        if (user) {
          console.log("achei user");
          return user.uid;
        }
        console.log("achei undefined");
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
      .catch((error) => {
        // The document probably doesn't exist.
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
