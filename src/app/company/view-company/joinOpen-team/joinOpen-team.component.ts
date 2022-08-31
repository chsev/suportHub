import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
    selector: 'app-joinOpen-team',
    templateUrl: './joinOpen-team.component.html',
  })
export class JoinOpenTeamComponent{
    constructor( 
        @Inject(MAT_DIALOG_DATA) public passedData: any
        ){ }
}