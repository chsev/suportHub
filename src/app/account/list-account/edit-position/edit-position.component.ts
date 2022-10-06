import { Component, Inject } from "@angular/core";
import { UntypedFormControl, UntypedFormGroup } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
    selector: 'app-edit-position',
    templateUrl: './edit-position.component.html',
})
export class EditPositionComponent {

    form = new UntypedFormGroup({
        position: new UntypedFormControl(''),
    })

    constructor(
        public dialogRef: MatDialogRef<EditPositionComponent>,
        @Inject(MAT_DIALOG_DATA) public passedData: any
    ) {
        this.form.controls['position'].setValue(this.passedData?.position);
    }

    onCancel() {
        this.dialogRef.close();
    }
}