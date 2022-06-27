import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
    selector: 'app-joinOpen-company',
    templateUrl: './joinOpen-company.component.html',
  })
export class JoinOpenCompanyComponent{
    constructor( 
        @Inject(MAT_DIALOG_DATA) public passedData: any
        ){ }
}