import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
    selector: 'app-joinClosed-company',
    templateUrl: './joinClosed-company.component.html',
  })
export class JoinClosedCompanyComponent{
    constructor( 
        @Inject(MAT_DIALOG_DATA) public passedData: any
        ){ }
}