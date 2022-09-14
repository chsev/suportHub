import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UiService } from 'src/app/shared/services/ui.service';
import { map } from 'rxjs/operators';
import { Team } from 'src/app/shared/models/team.model';
import { Observable, Subject, Subscription } from 'rxjs';
import { increment, arrayUnion, arrayRemove, serverTimestamp,  } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  teamArrayChanged = new Subject<Team[]>();
  availableTeams: Team[] = [];
  private firebaseSubs: Subscription[] = [];


  constructor(
    private db: AngularFirestore,
    private uiService: UiService,
  ) { }


  fetchTeams(companyId: string) {
    this.uiService.loadingStateChanged.next(true);

    this.firebaseSubs.push(
      this.db.collection('companies').doc(companyId).collection('teams').valueChanges({idField: 'id'})
        .subscribe({
          next: (fetchedTeams) => {
            if( fetchedTeams){
              this.availableTeams = fetchedTeams as Team[];
              this.teamArrayChanged.next([...fetchedTeams as Team[]]);
              this.uiService.loadingStateChanged.next(false);
            }
          },
          error: () => {
            this.uiService.showSnackbar('Fetching teams failed', undefined, 3000);
            this.uiService.loadingStateChanged.next(false);
          }
        })
    );
  }

  
  fetchTeamDoc(companyId: string, teamId: string): Observable<Team> {
    this.uiService.loadingStateChanged.next(true);
    return new Observable((observer) => {
      let sub = this.db.collection('companies').doc(companyId)
      .collection('teams').doc<Team>(teamId).get() 
        .subscribe({
          next: (doc) => {
            observer.next({...doc.data()!, id:teamId});
            this.uiService.loadingStateChanged.next(false);
            sub.unsubscribe();
          }, 
          error: (error) => {
            observer.error(error);
            this.uiService.loadingStateChanged.next(false);
            sub.unsubscribe();
          }
        })
    })
  }


  fetchTeam(companyId: string, teamId: string): Observable<Team> {
    return new Observable((observer) => {
      this.db.collection('companies').doc(companyId)
      .collection('teams').doc<Team>(teamId).valueChanges({idField: 'id'}) 
        .subscribe(
          (teamDoc) => {
            observer.next({...teamDoc as Team});
          })
    })
  }


  insert(team: Team) {
    this.db.collection('companies').doc(team.companyId)
      .collection('teams').add(team);
  }


  update(companyId: string, teamId: string, team: Team){
    this.db.collection('companies').doc(companyId)
      .collection('teams').doc(teamId).update(team);
  }


  remove(companyId: string, teamId: string){
    this.db.collection('companies').doc(companyId)
      .collection('teams').doc(teamId).delete();
  }


  searchById(teamId: string) {
      return this.availableTeams.find(team => team.id === teamId);
  }


  cancelSubscriptions() {
    this.firebaseSubs.forEach(sub => sub.unsubscribe());
  }


  addSystem(companyId:string, teamId: string, systemId: string){
    this.db.collection('companies').doc(companyId)
      .collection('teams').doc(teamId).update({
        systems: arrayUnion(systemId)
      });
  }


  addMember(companyId:string, teamId: string, userId: string){
    this.db.collection('companies').doc(companyId)
    .collection('teams').doc(teamId).update({
      members: arrayUnion(userId)
    });
  }


  removeMember(companyId:string, teamId: string, userId: string){
    this.db.collection('companies').doc(companyId)
    .collection('teams').doc(teamId).update({
      members: arrayRemove(userId)
    });
    this.removeAdmin(companyId, teamId, userId);
  }


  addAdmin(companyId:string, teamId: string, userId: string){
    this.db.collection('companies').doc(companyId)
    .collection('teams').doc(teamId).update({
      administrators: arrayUnion(userId)
    });
  }


  removeAdmin(companyId:string, teamId: string, userId: string){
    this.db.collection('companies').doc(companyId)
    .collection('teams').doc(teamId).update({
      administrators: arrayRemove(userId)
    });
  }


  requestApproval(companyId:string, teamId: string, userId: string){
    this.db.collection('companies').doc(companyId)
    .collection('teams').doc(teamId).update({
      waitingApproval: arrayUnion(userId)
    });
  }


  acceptMember(companyId:string, teamId: string, userId: string){
    this.addMember(companyId, teamId, userId);
    this.removeFromWaiting(companyId, teamId, userId);
  }


  rejectMember(companyId:string, teamId: string, userId: string){
    this.removeFromWaiting(companyId, teamId, userId);
  }

  
  removeFromWaiting(companyId:string, teamId: string, userId: string){
    this.db.collection('companies').doc(companyId)
    .collection('teams').doc(teamId).update({
      waitingApproval: arrayRemove(userId)
    });
  }


}
