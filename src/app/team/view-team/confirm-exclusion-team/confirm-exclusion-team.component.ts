import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: 'app-confirm-exclusion-team',
  templateUrl: './confirm-exclusion-team.component.html',
})
export class ConfirmExclusionTeamComponent  {

  constructor( @Inject(MAT_DIALOG_DATA) public passedData: any
  ){ }

}
