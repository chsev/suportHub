import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
    selector: 'app-delete-system',
    templateUrl: './delete-system.component.html',
  })
export class DeleteSystemComponent{
    constructor( @Inject(MAT_DIALOG_DATA) public passedData: any){ }
}