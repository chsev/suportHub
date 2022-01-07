import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UiService } from 'src/app/shared/services/ui.service';
import { map } from 'rxjs/Operators';
import { Team } from 'src/app/shared/models/team.model';
import { Subject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  teamArrayChanged = new Subject<Team[]>();
  availableTeams: Team[] = [];
  editingTeamId: string | null = null;
  editingTeamChanged = new Subject<Team>();
  private firebaseSubs: Subscription[] = [];


  constructor(
    private db: AngularFirestore,
    private uiService: UiService
  ) { }


  fetchTeams() {
    this.uiService.loadingStateChanged.next(true);

    this.firebaseSubs.push(
      this.db.collection('teams').snapshotChanges()
        .pipe(
          map(actions => actions.map(a => {
            const data = a.payload.doc.data() as Team;
            const id = a.payload.doc.id;
            return { ...data, id };
          }))
        )
        .subscribe(
          (fetchedTeams: Team[]) => {
            this.availableTeams = fetchedTeams;
            this.teamArrayChanged.next([...fetchedTeams]);
            this.uiService.loadingStateChanged.next(false);
          },
          error => {
            this.uiService.showSnackbar('Fetching teams failed', undefined, 3000);
            this.uiService.loadingStateChanged.next(false);
          }
        )
    )
  }


  insert(team: Team) {
    this.db.collection('teams').add(team);
  }

  update(team: Team){
    this.db.collection('teams').doc(team.id).update(team);
  }

  remove(id: string){
    this.db.collection('teams').doc(id).delete();
  }

  searchById(id: string) {
    this.editingTeamChanged.next({
      ...this.availableTeams.find(team => team.id === id)
    })
  }

  cancelSubscriptions() {
    this.firebaseSubs.forEach(sub => sub.unsubscribe());
  }



}
