import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
    selector: 'app-delete-team',
    templateUrl: './delete-team.component.html',
  })
export class DeleteTeamComponent{
    constructor( @Inject(MAT_DIALOG_DATA) public passedData: any){ }
}