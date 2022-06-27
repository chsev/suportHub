import { Injectable } from '@angular/core';
import { AngularFirestore, FieldPath } from '@angular/fire/compat/firestore';
import { UiService } from 'src/app/shared/services/ui.service';
import { map } from 'rxjs/Operators';
import { Company } from 'src/app/shared/models/company.model';
import { Observable, Subject, Subscription } from 'rxjs';
import { increment, arrayUnion } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  companyArrayChanged = new Subject<Company[]>();
  availableCompanies: Company[] = [];
  editingCompanyId: string | null = null;
  editingCompanyChanged = new Subject<Company>();
  private firebaseSubs: Subscription[] = [];


  constructor(
    private db: AngularFirestore,
    private uiService: UiService
  ) { }

  fetchCompanies() {
    this.uiService.loadingStateChanged.next(true);

    this.firebaseSubs.push(
      this.db.collection('companies').snapshotChanges()
        .pipe(
          map(actions => actions.map(a => {
            const data = a.payload.doc.data() as Company;
            const id = a.payload.doc.id;
            return { ...data, id };
          }))
        )
        .subscribe(
          (fetchedCompanies: Company[]) => {
            // console.log(fetchedCompanies);
            this.availableCompanies = fetchedCompanies;
            this.companyArrayChanged.next([...fetchedCompanies]);
            this.uiService.loadingStateChanged.next(false);
          },
          error => {
            // console.log(error);
            this.uiService.showSnackbar('Fetching companies failed', undefined, 3000);
            this.uiService.loadingStateChanged.next(false);
          }
        )
    )
  }


  fetchCompanyDoc(companyId: string): Observable<Company> {
    this.uiService.loadingStateChanged.next(true);

    return new Observable((observer) => {
      this.db.collection('companies').doc<Company>(companyId).get() //id?
        .subscribe(
          (doc) => {
            // let companyData = doc.data();
            // console.log(companyData);
            observer.next({...doc.data(), id:companyId});
            this.uiService.loadingStateChanged.next(false);
          }
          , (error) => {
            observer.error(error);
            this.uiService.loadingStateChanged.next(false);
          }
        )
    })
  }


  async insert(company: Company) {
    return this.db.collection('companies').add(company)
      .then(
        (docRef) => {
          console.log("newDoc:" + docRef.id)
          return docRef.id;
        }
      ).catch(
        (err) => {
          console.log(err);
          return undefined;
        })
  }

  update(companyId: string, company: Company) {
    this.db.collection('companies').doc(companyId).update(company);
  }

  remove(id: string) {
    this.db.collection('companies').doc(id).delete();
  }

  searchById(id: string) {
    this.editingCompanyChanged.next({
      ...this.availableCompanies.find(comp => comp.id === id)
    })
  }

  addMember(companyId:string, userId: string){
    this.db.collection('companies').doc(companyId).update({
      nMembers: increment(1), 
      members: arrayUnion(userId)
    })
  }

  cancelSubscriptions() {
    this.firebaseSubs.forEach(sub => sub.unsubscribe());
  }
}
