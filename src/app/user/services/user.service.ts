import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UiService } from 'src/app/shared/services/ui.service';
import { map } from 'rxjs/operators';
import { User } from 'src/app/shared/models/user.model';
import { Subject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userArrayChanged = new Subject<User[]>();
  availableUsers: User[] = [];
  editingUserId: string | null = null;
  editingUserChanged = new Subject<User>();
  private firebaseSubs: Subscription[] = [];


  constructor(
    private db: AngularFirestore,
    private uiService: UiService
  ) { }


  fetchUsers() {
    this.uiService.loadingStateChanged.next(true);

    this.firebaseSubs.push(
      this.db.collection('users').snapshotChanges()
        .pipe(
          map(actions => actions.map(a => {
            const data = a.payload.doc.data() as User;
            const id = a.payload.doc.id;
            return { ...data, id };
          }))
        )
        .subscribe(
          (fetchedUsers: User[]) => {
            this.availableUsers = fetchedUsers;
            this.userArrayChanged.next([...fetchedUsers]);
            this.uiService.loadingStateChanged.next(false);
          },
          error => {
            this.uiService.showSnackbar('Fetching users failed', undefined, 3000);
            this.uiService.loadingStateChanged.next(false);
          }
        )
    )
  }


  insert(user: User) {
    const id = this.db.createId();
    this.db.collection('users').doc(id).set(user);
    // this.db.collection('users').add(user);
  }

  update(user: User){
    // this.db.collection('users').doc(user.id).update(user);
  }

  remove(id: string){
    this.db.collection('users').doc(id).delete();
  }

  searchById(id: string) {
    this.editingUserChanged.next({
      // ...this.availableUsers.find(user => user.id === id)
    })
  }

  cancelSubscriptions() {
    this.firebaseSubs.forEach(sub => sub.unsubscribe());
  }



}
