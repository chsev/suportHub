import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
    selector: 'app-confirm-reset',
    templateUrl: './confirm-reset.component.html',
  })
export class ConfirmResetComponent{
    constructor( 
        @Inject(MAT_DIALOG_DATA) public passedData: any
        ){ }
}