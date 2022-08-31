import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
    selector: 'app-joinClosed-team',
    templateUrl: './joinClosed-team.component.html',
  })
export class JoinClosedTeamComponent{
    constructor( 
        @Inject(MAT_DIALOG_DATA) public passedData: any
        ){ }
}