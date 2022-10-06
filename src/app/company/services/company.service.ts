import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UiService } from 'src/app/shared/services/ui.service';
import { Company } from 'src/app/shared/models/company.model';
import { Observable } from 'rxjs';
import { increment, arrayUnion, arrayRemove, serverTimestamp } from '@angular/fire/firestore';
import { AccountService } from 'src/app/account/services/account.service';
import { Invitation } from 'src/app/shared/models/invitation.model';
import { TeamService } from 'src/app/team/services/team.service';
import { SystemService } from 'src/app/system/services/system.service';
import { PostService } from 'src/app/post/services/post.service';


@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(
    private db: AngularFirestore,
    private uiService: UiService,
    private accountService: AccountService,
    private teamService: TeamService,
    private systemService: SystemService,
    private postService: PostService
  ) { }


  fetchPublicCompanies(): Observable<Company[]> {
    return new Observable((observer) => {
      this.db.collection<Company>('companies', ref => ref.where('isPublic', '==', true))
        .valueChanges({ idField: 'id' })
        .subscribe((companies) => {
          observer.next(companies);
        });
    });
  }


  fetchCompanyDoc(companyId: string): Observable<Company> {
    return new Observable((observer) => {
      this.db.collection('companies').doc<Company>(companyId).get() //id?
        .subscribe({
          next: (doc) => {
            observer.next({ ...doc.data(), id: companyId });
          },
          error: (error) => {
            observer.error(error);
          }
        });
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


  fetchCompanyList(companyIds: string[]): Observable<Company[]> {
    return new Observable((observer) => {
      let len = companyIds.length;

      if (len == 0) {
        observer.next([]);
        return;
      }

      let count = 0
      let companies: Company[] = [];
      companyIds.forEach((id) => {
        this.db.collection('companies').doc<Company>(id).get()
          .subscribe({
            next: (companydoc) => {
              let company: Company | undefined = companydoc.data();
              if (company) {
                companies.push({ id: id, ...company });
                count++;
                if (count == len) {
                  observer.next(companies);
                }
              }
            },
            error: () => {
              count++;
              if (count == len) {
                observer.next(companies);
              }
            }
          });
      });
    });
  }


  async insert(company: Company): Promise<string | undefined> {
    let newCompanyId = this.db.createId();
    let companyRef = this.db.collection('companies').doc(newCompanyId);

    return companyRef.set({
      name: company.name,
      segment: company.segment,
      description: company.description,
      isOpen: company.isOpen,
      isPublic: company.isPublic,
      nMembers: 1
    })
      .then(() => {
        companyRef.collection('data').doc('data').set({
          members: company.administrators,
          administrators: company.administrators,
          waitingApproval: []
        });
        return newCompanyId;
      })
      .catch(
        (err) => {
          this.uiService.showSnackbar('Error creating company: ' + err.toString(), undefined, 3000);
          return undefined;
        });
  }


  update(companyId: string, company: Company) {
    this.db.collection('companies').doc(companyId).update(company);
  }


  remove(id: string) {
    let companyRef = this.db.collection('companies').doc(id);

    companyRef.collection('teams').get()
    .subscribe( teams => {
      teams.forEach( t => this.teamService.delete(id, t.id));
    });

    companyRef.collection('systems').get()
    .subscribe( systems => {
      systems.forEach( s => this.systemService.delete(id, s.id));
    });

    companyRef.collection('post').get()
    .subscribe( posts => {
      posts.forEach( p => this.postService.delete(id, p.id));
    });

    companyRef.collection('data').doc('data').delete();

    this.db.collection('users', ref => ref.where('companyId', '==', id)).get()
    .subscribe( users => {
        users.forEach( u => this.accountService.updateUserCompany(undefined, u.id));
      });

    this.db.collection('invitations', ref => ref.where('companyId', '==', id)).get().subscribe(
      invites => {
        invites.forEach( i => i.ref.delete() );
      });

    companyRef.delete();
  }


  //---------
  //  Admins
  //---------
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


  //---------
  //  Members
  //---------
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
        () => this.accountService.updatePendingApproval(companyId, userId)
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
        () => this.accountService.updatePendingApproval(undefined, userId)
      );
  }


  //---------------
  //  Invitations
  //---------------
  createInvitation(companyId: string, userEmail: string) {
    this.db.collection('invitations').add({
      userMail: userEmail,
      companyId: companyId,
      status: 'open',
      created: serverTimestamp()
    });
  }


  fetchInvitations(userEmail: string): Observable<Invitation[]> {
    return new Observable((observer) => {
      this.db.collection<Invitation>('invitations',
        ref => ref.where('userMail', '==', userEmail).where('status', '==', 'open')
      )
        .valueChanges({ idField: 'id' })
        .subscribe( 
          (invites) => observer.next(invites)
        );
    });
  }


  acceptInvite(invite: Invitation, userId: string){
    this.db.collection('invitations').doc(invite.id!).update({
      status: 'accepted'
    });

    this.addMember(invite.companyId, userId);
  }


  refuseInvite(inviteId: string){
    this.db.collection('invitations').doc(inviteId).update({
      status: 'refused'
    });
  }

}
