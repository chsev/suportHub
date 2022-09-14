import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UiService } from 'src/app/shared/services/ui.service';
import { Company } from 'src/app/shared/models/company.model';
import { Observable, Subject, Subscription } from 'rxjs';
import { increment, arrayUnion, arrayRemove, serverTimestamp, documentId } from '@angular/fire/firestore';
import { AccountService } from 'src/app/account/services/account.service';


@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  // companyArrayChanged = new Subject<Company[]>();
  // availableCompanies: Company[] = [];
  // editingCompanyId: string | null = null;
  // editingCompanyChanged = new Subject<Company>();
  private firebaseSubs: Subscription[] = [];


  constructor(
    private db: AngularFirestore,
    private uiService: UiService,
    private accountService: AccountService
  ) { }


  // fetchCompanies() {
  //   this.uiService.loadingStateChanged.next(true);

  //   this.firebaseSubs.push(
  //     this.db.collection('companies').valueChanges({ idField: 'id' })
  //       .subscribe({
  //         next: (fetchedCompanies: Company[]) => {
  //           this.availableCompanies = fetchedCompanies;
  //           this.companyArrayChanged.next([...fetchedCompanies]);
  //           this.uiService.loadingStateChanged.next(false);
  //         },
  //         error: () => {
  //           this.uiService.showSnackbar('Fetching companies failed', undefined, 3000);
  //           this.uiService.loadingStateChanged.next(false);
  //         }
  //       })
  //   );
  // }

  getPublicCompanies(): Observable<Company[]> {
    return new Observable((observer) => {
      this.db.collection<Company>('companies', ref => ref.where('isPublic','==', true))
      .get().subscribe( (companies) => {
        console.log(companies);
        let asa = companies.docs.map(e => e.data()) as Company[];
        observer.next(asa);
      })
    })
  }


  fetchCompanyDoc(companyId: string): Observable<Company> {
    this.uiService.loadingStateChanged.next(true);

    return new Observable((observer) => {
      this.db.collection('companies').doc<Company>(companyId).get() //id?
        .subscribe({
          next: (doc) => {
            observer.next({ ...doc.data(), id: companyId });
            this.uiService.loadingStateChanged.next(false);
          },
          error: (error) => {
            observer.error(error);
            this.uiService.loadingStateChanged.next(false);
          }
        })
    });
  }


  fetchCompanyData(companyId: string): Observable<Company> {
    return new Observable((observer) => {
      let cpyDocRef = this.db.collection('companies').doc<Company>(companyId);
      cpyDocRef.collection('data').doc('data').valueChanges()
        .subscribe((data) => {
          observer.next({ id: companyId, ...data });
        });
    });
  }


  async insert(company: Company): Promise<string | undefined> {
    let newCompanyId = this.db.createId();
    let cpyRef = this.db.collection('companies').doc(newCompanyId);

    cpyRef.set({
      name: company.name,
      segment: company.segment,
      description: company.description,
      isOpen: company.isOpen,
      isPublic: company.isPublic,
      nMembers: 1
    })
      .then(() => {
        cpyRef.collection('data').doc('data').set({
          members: company.administrators,
          administrators: company.administrators,
          waitingApproval: []
        });
        return newCompanyId;
      })
      .catch(
        (err) => {
          console.log(err);
          return undefined;
        })
    return undefined;
  }

  update(companyId: string, company: Company) {
    this.db.collection('companies').doc(companyId).update(company);
  }

  remove(id: string) {
    this.db.collection('companies').doc(id).delete();
  }


  addMember(companyId: string, userId: string) {
    let cpyDocRef = this.db.collection('companies').doc(companyId);
    cpyDocRef.collection('data').doc('data').update({
      members: arrayUnion(userId)
    })
      .then(() => {
        cpyDocRef.update({
          nMembers: increment(1)
        })
      })
      .then(() => {
        this.accountService.updateUserCompany(companyId, userId);
      })
  }


  addAdmin(companyId: string, userId: string) {
    this.db.collection('companies').doc(companyId)
      .collection('data').doc('data').update({
        administrators: arrayUnion(userId)
      })
  }


  removeAdmin(companyId: string, userId: string) {
    this.db.collection('companies').doc(companyId)
      .collection('data').doc('data').update({
        administrators: arrayRemove(userId)
      })
  }


  removeMember(companyId: string, userId: string) {
    let cpyDocRef = this.db.collection('companies').doc(companyId);
    cpyDocRef.collection('data').doc('data').update({
      members: arrayRemove(userId)
    })
      .then(() => {
        cpyDocRef.update({
          nMembers: increment(-1)
        })
      })
      .then(() => {
        this.accountService.updateUserCompany(undefined, userId);
      });
    this.removeAdmin(companyId, userId);
  }


  requestApproval(companyId: string, userId: string) {
    this.db.collection('companies').doc(companyId).collection('data').doc('data')
      .update({
        waitingApproval: arrayUnion(userId)
      })
      .then(
        () => this.accountService.updateUserPendingApproval(companyId, userId)
      )
  }


  acceptMember(companyId: string, userId: string) {
    this.addMember(companyId, userId);
    this.removeFromWaiting(companyId, userId);
  }


  rejectMember(companyId: string, userId: string) {
    this.removeFromWaiting(companyId, userId);
  }


  removeFromWaiting(companyId: string, userId: string) {
    this.db.collection('companies').doc(companyId).collection('data').doc('data')
      .update({
        waitingApproval: arrayRemove(userId)
      }).then(
        () => this.accountService.updateUserPendingApproval(undefined, userId)
      );
  }


  cancelSubscriptions() {
    this.firebaseSubs.forEach(sub => sub.unsubscribe());
  }
}
