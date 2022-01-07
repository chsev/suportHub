import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
    selector: 'app-delete-company',
    templateUrl: './delete-company.component.html',
  })
export class DeleteCompanyComponent{
    constructor( @Inject(MAT_DIALOG_DATA) public passedData: any){ }
}