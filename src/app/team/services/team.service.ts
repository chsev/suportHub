import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UiService } from 'src/app/shared/services/ui.service';
import { map } from 'rxjs/operators';
import { Team } from 'src/app/shared/models/team.model';
import { Observable, Subject, Subscription } from 'rxjs';
import { increment, arrayUnion } from '@angular/fire/firestore';

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
      this.db.collection('companies').doc(companyId).collection('teams').snapshotChanges()
        .pipe(
          map(actions => actions.map(a => {
            const data = a.payload.doc.data() as Team;
            const id = a.payload.doc.id;
            return { ...data, id: id };
          }))
        )
        .subscribe(
          (fetchedTeams: Team[]) => {
            this.availableTeams = fetchedTeams;
            this.teamArrayChanged.next([...fetchedTeams]);
            this.uiService.loadingStateChanged.next(false);
          },
          () => {
            this.uiService.showSnackbar('Fetching teams failed', undefined, 3000);
            this.uiService.loadingStateChanged.next(false);
          }
        )
    )
  }

  
  fetchTeamDoc(companyId: string, teamId: string): Observable<Team> {
    this.uiService.loadingStateChanged.next(true);
    return new Observable((observer) => {
      let sub = this.db.collection('companies').doc(companyId)
      .collection('teams').doc<Team>(teamId).get() 
        .subscribe(
          (doc) => {
            observer.next({...doc.data()!, id:teamId});
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
      })
  }



}
