import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { increment} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Doc } from 'src/app/shared/models/doc.model';


@Injectable({
  providedIn: 'root'
})
export class DocService {

  constructor(
    private db: AngularFirestore
  ) { }


  insert(companyId: string, systemId: string, docId: string, newDoc: Doc) {
    let systemRef = this.getSystemRef(companyId, systemId);

    systemRef.collection('documents').doc(docId)
      .set(newDoc)
      .then(() => systemRef.update({
        nDocs: increment(1)
      })
      );
  }


  delete(companyId: string, systemId: string, docId: string, updateSystem = true) {
    if(updateSystem){
      this.getSystemRef(companyId, systemId).update({
        nDocs: increment(-1)
      });
    }
    return this.getDocRef<Doc>(companyId, systemId, docId).delete()
  }


  getDocumentList(companyId: string, systemId: string, docIDs: string[]): Observable<Doc[]> {
    return new Observable((observer) => {
      let documents: Doc[] = [];
      docIDs.forEach((id) => {
        this.getDocRef<Doc>(companyId, systemId, id).get()
          .subscribe((doc) => {
            if (doc.data()) {
              documents.push({ ...doc.data()!, id: id });
              observer.next(documents);
            }
          })
      })
    })
  }


  fetchSystemDocuments(companyId: string, systemId: string): Observable<Doc[]> {
    return new Observable((observer) => {
      this.getSystemRef(companyId, systemId).collection<Doc>('documents')
        .valueChanges({ idField: 'id' })
        .subscribe({
          next: (fetchedDocs: Doc[]) => {
            observer.next(fetchedDocs);
          },
          error: (error) => {
            observer.error(error);
          }
        })
    })
  }



  private getSystemRef(companyId: string, systemId: string) {
    return this.db.collection('companies').doc(companyId)
      .collection('systems').doc(systemId);
  }


  private getDocRef<T>(companyId: string, systemID: string, docId: string) {
    return this.db.collection('companies').doc(companyId)
      .collection('systems').doc(systemID)
      .collection('documents').doc<T>(docId);
  }

}


