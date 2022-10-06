import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-send-invite-company',
  templateUrl: './send-invite-company.component.html'
})
export class SendInviteCompanyComponent implements OnInit {

  form: UntypedFormGroup = new UntypedFormGroup({
    email: new UntypedFormControl('',  {validators: [Validators.required, Validators.email]}),
  })


  constructor( 
    public dialogRef: MatDialogRef<SendInviteCompanyComponent>,
    @Inject(MAT_DIALOG_DATA) public passedData: any
    ){ }

  ngOnInit(): void {
  }

  onCancel(){
    this.dialogRef.close();
  }

  sendInvite(){
    this.dialogRef.close( this.form.controls['email'].value );
  }

}
