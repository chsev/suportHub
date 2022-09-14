import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: 'app-confirm-exclusion-company',
  templateUrl: './confirm-exclusion-company.component.html'
})
export class ConfirmExclusionCompanyComponent {

  constructor( @Inject(MAT_DIALOG_DATA) public passedData: any
  ){ }

 

}
