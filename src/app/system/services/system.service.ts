import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UiService } from 'src/app/shared/services/ui.service';
import { System } from 'src/app/shared/models/system.model';
import { Observable } from 'rxjs';
import { DocService } from './doc.service';


@Injectable({
  providedIn: 'root'
})
export class SystemService {

  constructor(
    private db: AngularFirestore,
    private uiService: UiService,
    private docService: DocService
  ) { }


  getSystem(companyId: string, systemId: string): Observable<System> {
    return new Observable((observer) => {
      this.db.collection('companies').doc(companyId)
        .collection('systems').doc<System>(systemId).get()
        .subscribe(
          (doc) => observer.next({ ...doc.data()!, id: systemId })
        )
    });
  }


  getSystemList(companyId: string, systemsIDs: string[]): Observable<System[]> {
    return new Observable((observer) => {
      let len = systemsIDs.length;
      if (len == 0) {
        observer.next([]);
        return;
      }

      let count = 0
      let systems: System[] = [];
      systemsIDs.forEach((id) => {
        this.getSystemRef<System>(companyId, id).get().subscribe({
          next: (sysSnap) => {
            systems.push({ id: sysSnap.id, ...sysSnap.data() } as System);
            count++;
            if (count == len) {
              observer.next(systems);
            }
          },
          error: () => {
            count++;
            if (count == len) {
              observer.next(systems);
            }
          }
        });
      });
    });
  }


  fetchCompanySystems(companyId: string) {
    return new Observable((observer) => {
      this.db.collection('companies').doc(companyId).collection<System>('systems')
        .valueChanges({ idField: 'id' })
        .subscribe({
          next: (fetchedSystems) => observer.next(fetchedSystems),
          error: () => this.uiService.showSnackbar('Fetching systems failed', undefined, 3000)
        });
    });
  }


  async insert(system: System): Promise<string | undefined> {
    return this.db.collection('companies').doc(system.companyId)
      .collection('systems').add(system)
      .then((docRef) => {
        return docRef.id;
      })
      .catch(() => {
        return undefined;
      })
  }


  update(companyId: string, systemId: string, system: System) {
    this.getSystemRef(companyId, systemId).update(system);
  }


  delete(companyId: string, systemId: string) {
    this.deleteDocuments(companyId, systemId);
    this.getSystemRef(companyId, systemId).delete();
  }


  private deleteDocuments(companyId: string, systemId: string) {
    this.getSystemRef(companyId, systemId).collection('documents').get()
      .subscribe((docs) => {
        docs.forEach(doc => this.docService.delete(companyId, systemId, doc.id, false));
      });
  }


  private getSystemRef<T>(companyId: string, systemId: string) {
    return this.db.collection('companies').doc(companyId)
      .collection('systems').doc<T>(systemId);
  }

}
