import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
    selector: 'app-delete-user',
    templateUrl: './delete-user.component.html',
  })
export class DeleteUserComponent{
    constructor( @Inject(MAT_DIALOG_DATA) public passedData: any){ }
}