import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UiService } from 'src/app/shared/services/ui.service';
import { Team } from 'src/app/shared/models/team.model';
import { Observable } from 'rxjs';
import { arrayUnion, arrayRemove } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class TeamService {

  constructor(
    private db: AngularFirestore,
    private uiService: UiService,
  ) { }


  fetchTeam(companyId: string, teamId: string): Observable<Team> {
    return new Observable((observer) => {
      this.getTeamRef<Team>(companyId, teamId).valueChanges({ idField: 'id' })
        .subscribe(
          (teamDoc) => {
            observer.next(teamDoc);
          });
    })
  }


  fetchCompanyTeams(companyId: string): Observable<Team[]> {
    return new Observable((observer) => {
      this.db.collection('companies').doc(companyId).collection<Team>('teams')
        .valueChanges({ idField: 'id' })
        .subscribe({
          next: (fetchedTeams) => {
            if (fetchedTeams) {
              observer.next(fetchedTeams);
            }
          },
          error: () => {
            this.uiService.showSnackbar('Fetching teams failed', undefined, 3000);
          }
        });
    });
  }


  fetchUserTeams(companyId: string, userId: string): Observable<Team[]> {
    return new Observable((observer) => {
      this.db.collection('companies').doc(companyId)
        .collection<Team>('teams', ref => ref.where('members', 'array-contains', userId))
        .valueChanges({ idField: 'id' })
        .subscribe((teams) => observer.next(teams));
    })
  }


  insert(team: Team) {
    this.db.collection('companies').doc(team.companyId)
      .collection('teams').add(team);
  }


  update(companyId: string, teamId: string, team: Team) {
    this.getTeamRef(companyId, teamId).update(team);
  }


  delete(companyId: string, teamId: string) {
    this.getTeamRef(companyId, teamId).delete();
  }


  addSystem(companyId: string, teamId: string, systemId: string) {
    this.getTeamRef(companyId, teamId).update({
      systems: arrayUnion(systemId)
    });
  }

  removeSystem(companyId: string, teamId: string, systemId: string){
    this.getTeamRef(companyId, teamId).update({
      systems: arrayRemove(systemId)
    });
  }


  private getTeamRef<T>(companyId: string, teamId: string) {
    return this.db.collection('companies').doc(companyId)
      .collection<T>('teams').doc(teamId);
  }


  //----------
  // Admins
  //-----------
  addAdmin(companyId: string, teamId: string, userId: string) {
    this.getTeamRef(companyId, teamId).update({
      administrators: arrayUnion(userId)
    });
  }


  removeAdmin(companyId: string, teamId: string, userId: string) {
    this.getTeamRef(companyId, teamId).update({
      administrators: arrayRemove(userId)
    });
  }


  //----------
  //  Members
  //-----------
  addMember(companyId: string, teamId: string, userId: string) {
    this.getTeamRef(companyId, teamId).update({
      members: arrayUnion(userId)
    });
  }


  removeMember(companyId: string, teamId: string, userId: string) {
    this.getTeamRef(companyId, teamId).update({
      members: arrayRemove(userId)
    });
    this.removeAdmin(companyId, teamId, userId);
  }


  requestApproval(companyId: string, teamId: string, userId: string) {
    this.getTeamRef(companyId, teamId).update({
      waitingApproval: arrayUnion(userId)
    });
  }


  acceptMember(companyId: string, teamId: string, userId: string) {
    this.addMember(companyId, teamId, userId);
    this.removeFromWaiting(companyId, teamId, userId);
  }


  rejectMember(companyId: string, teamId: string, userId: string) {
    this.removeFromWaiting(companyId, teamId, userId);
  }


  private removeFromWaiting(companyId: string, teamId: string, userId: string) {
    this.getTeamRef(companyId, teamId).update({
      waitingApproval: arrayRemove(userId)
    });
  }

  removeFromAll(companyId: string, userId: string){
    this.fetchUserTeams(companyId, userId)
    .subscribe( 
      teams => teams.forEach(t => this.removeMember(companyId, t.id!, userId) )
    );
  }


}
