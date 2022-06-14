import { Component, Inject } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
    selector: 'app-edit-position',
    templateUrl: './edit-position.component.html',
  })
export class EditPositionComponent{

    positionForm: FormGroup = new FormGroup({
        position: new FormControl({value: this.passedData?.position}),
      })

    constructor(
        public dialogRef: MatDialogRef<EditPositionComponent>, 
        @Inject(MAT_DIALOG_DATA) public passedData: any
        ){
            // this.positionForm.setValue({
            //     position: this.passedData?.position,
            // })
            this.positionForm.controls['position'].setValue(this.passedData?.position);
        }
    
    onCancel(){
        // this.positionForm.controls['position'].value();
        this.dialogRef.close();
    }
}