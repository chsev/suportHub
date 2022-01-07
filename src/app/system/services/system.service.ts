import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UiService } from 'src/app/shared/services/ui.service';
import { map } from 'rxjs/Operators';
import { System } from 'src/app/shared/models/system.model';
import { Subject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SystemService {
  systemArrayChanged = new Subject<System[]>();
  availableSystems: System[] = [];
  editingSystemId: string | null = null;
  editingSystemChanged = new Subject<System>();
  private firebaseSubs: Subscription[] = [];


  constructor(
    private db: AngularFirestore,
    private uiService: UiService
  ) { }


  fetchSystems() {
    this.uiService.loadingStateChanged.next(true);

    this.firebaseSubs.push(
      this.db.collection('systems').snapshotChanges()
        .pipe(
          map(actions => actions.map(a => {
            const data = a.payload.doc.data() as System;
            const id = a.payload.doc.id;
            return { ...data, id };
          }))
        )
        .subscribe(
          (fetchedSystems: System[]) => {
            this.availableSystems = fetchedSystems;
            this.systemArrayChanged.next([...fetchedSystems]);
            this.uiService.loadingStateChanged.next(false);
          },
          error => {
            this.uiService.showSnackbar('Fetching systems failed', undefined, 3000);
            this.uiService.loadingStateChanged.next(false);
          }
        )
    )
  }


  insert(system: System) {
    this.db.collection('systems').add(system);
  }

  update(system: System){
    this.db.collection('systems').doc(system.id).update(system);
  }

  remove(id: string){
    this.db.collection('systems').doc(id).delete();
  }

  searchById(id: string) {
    this.editingSystemChanged.next({
      ...this.availableSystems.find(system => system.id === id)
    })
  }

  cancelSubscriptions() {
    this.firebaseSubs.forEach(sub => sub.unsubscribe());
  }



}
