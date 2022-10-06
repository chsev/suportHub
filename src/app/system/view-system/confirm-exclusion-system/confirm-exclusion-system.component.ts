import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-exclusion-system',
  templateUrl: './confirm-exclusion-system.component.html',
})
export class ConfirmExclusionSystemComponent {

  constructor( 
    @Inject(MAT_DIALOG_DATA) public passedData: any 
    ) { }


}
