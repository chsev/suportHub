import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Doc } from 'src/app/shared/models/doc.model';
import { UiService } from 'src/app/shared/services/ui.service';

@Injectable({
  providedIn: 'root'
})
export class DocService {

  constructor(
    private db: AngularFirestore,
    private uiService: UiService,
  ) { }

  insert(companyId: string, systemId: string, docId: string, newDoc: Doc) {
    this.db
      .collection('companies').doc(companyId)
      .collection('systems').doc(systemId)
      .collection('documents').doc(docId).set(newDoc);
  }


  fetchDocumentsList(companyId: string, systemID: string, docIDs: string[]): Observable<Doc[]> {
    return new Observable((observer) => {
      let documents: Doc[] = [];
      docIDs.forEach((id) => {
        let sub = this.db.collection('companies').doc(companyId)
          .collection('systems').doc(systemID)
          .collection('documents').doc<Doc>(id).get()
          .subscribe((doc) => {
            if (doc.data()) {
              documents.push({ ...doc.data()!, id: id });
              observer.next(documents);
              sub.unsubscribe();
            }
          })
      })
    })
  }

  fetchAllDocumentsOfSystem(companyId: string, systemId: string): Observable<Doc[]> {
    this.uiService.loadingStateChanged.next(true);

    return new Observable((observer) => {
      this.db.collection('companies').doc(companyId)
        .collection('systems').doc(systemId)
        .collection('documents').snapshotChanges()
        .pipe( map(actions => actions.map(
          a => {
            const data = a.payload.doc.data() as Doc;
            const id = a.payload.doc.id;
            return { ...data, id: id };
          }
        )))
        .subscribe(
          (fetchedDocs: Doc[]) => {
            observer.next(fetchedDocs);
            this.uiService.loadingStateChanged.next(false);
          },
          (error) => {
            observer.error(error);
            this.uiService.loadingStateChanged.next(false);
          }
        )
    })
  }


  // toFilePath(companyId: string, systemId: string, docId: string, fileName: string) {
  //   return ['companies', companyId, 'systems', systemId, 'docs', docId, fileName].join('/');
  // }





}


