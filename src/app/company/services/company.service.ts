import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UiService } from 'src/app/shared/services/ui.service';
import { map } from 'rxjs/Operators';
import { Company } from 'src/app/shared/models/company.model';
import { Subject, Subscription } from 'rxjs';

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


  insert(company: Company) {
    this.db.collection('companies').add(company);
  }

  update(company: Company){
    this.db.collection('companies').doc(company.id).update(company);
  }

  remove(id: string){
    this.db.collection('companies').doc(id).delete();
  }

  searchById(id: string) {
    this.editingCompanyChanged.next({
      ...this.availableCompanies.find(comp => comp.id === id)
    })
  }

  cancelSubscriptions() {
    this.firebaseSubs.forEach(sub => sub.unsubscribe());
  }



}
