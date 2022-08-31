import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UiService } from 'src/app/shared/services/ui.service';
import { map } from 'rxjs/operators';
import { System } from 'src/app/shared/models/system.model';
import { Observable, Subject, Subscription } from 'rxjs';
import { arrayUnion } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SystemService {
  systemArrayChanged = new Subject<System[]>();
  availableSystems: System[] = [];
  private firebaseSubs: Subscription[] = [];


  constructor(
    private db: AngularFirestore,
    private uiService: UiService,
  ) { }


  fetchSystems(companyId: string) {
    this.uiService.loadingStateChanged.next(true);

    this.firebaseSubs.push(
      this.db.collection('companies').doc(companyId).collection('systems').snapshotChanges()
        .pipe(
          map(actions => actions.map(a => {
            const data = a.payload.doc.data() as System;
            const id = a.payload.doc.id;
            return { ...data, id: id };
          }))
        )
        .subscribe(
          (fetchedSystems: System[]) => {
            this.availableSystems = fetchedSystems;
            this.systemArrayChanged.next([...fetchedSystems]);
            this.uiService.loadingStateChanged.next(false);
          },
          () => {
            this.uiService.showSnackbar('Fetching systems failed', undefined, 3000);
            this.uiService.loadingStateChanged.next(false);
          }
        )
    )
  }

  fetchSystemDoc(companyId: string, systemId: string): Observable<System> {
    this.uiService.loadingStateChanged.next(true);
    return new Observable((observer) => {
      let sub = this.db.collection('companies').doc(companyId)
      .collection('systems').doc<System>(systemId).get() 
        .subscribe(
          (doc) => {
            observer.next({...doc.data()!, id:systemId});
            this.uiService.loadingStateChanged.next(false);
            sub.unsubscribe();
          }, 
          (error) => {
            observer.error(error);
            this.uiService.loadingStateChanged.next(false);
            sub.unsubscribe();
          })
    })
  }

  
  fetchSystemDocList(companyId: string, systemsIDs: string[]): Observable<System[]> {
    return new Observable((observer) => {
      let systems: System[] = [];
      systemsIDs.forEach((id) => {
        let sub = this.db.collection('companies').doc(companyId)
        .collection('systems').doc<System>(id).get()
          .subscribe((doc) => {
            if (doc.data()?.name) {
              systems.push({ ...doc.data()!, id: id });
              observer.next(systems);
              sub.unsubscribe();
            }
          })
      })
    })
  }
  

  async insert(system: System) {
    return this.db.collection('companies').doc(system.companyId)
      .collection('systems').add(system)
      .then( (docRef)=> {
        return docRef.id;
      })
      .catch( (err) => {
        return undefined;
      })
  }


  update(companyId: string, systemId: string, system: System){
    this.db.collection('companies').doc(companyId)
      .collection('systems').doc(systemId).update(system);
  }

  remove(companyId: string, systemId: string){
    this.db.collection('companies').doc(companyId)
      .collection('systems').doc(systemId).delete();
  }

  searchById(systemId: string) {
    return this.availableSystems.find(system => system.id == systemId);
  }


  // addDoc(companyId: string, systemId: string, docId: string){
  //   this.db.collection('companies').doc(companyId)
  //   .collection('systems').doc(systemId).update({
  //     docs: arrayUnion(docId)
  //   })
  // }


  cancelSubscriptions() {
    this.firebaseSubs.forEach(sub => sub.unsubscribe());
  }



}
