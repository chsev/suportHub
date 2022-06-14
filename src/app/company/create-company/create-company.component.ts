import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/account/services/account.service';
import { User } from 'src/app/shared/models/user.model';
import { CompanyService } from '../services/company.service';

@Component({
  selector: 'app-create-company',
  templateUrl: './create-company.component.html',
  styleUrls: ['./create-company.component.css']
})
export class CreateCompanyComponent implements OnInit {
  companyForm!: UntypedFormGroup;
  user: User | undefined;
  userID: string | undefined; 
  adminName: string = '';

  constructor(
    private router: Router,
    private companyService: CompanyService,
    private accountService: AccountService,
  ) { }

  ngOnInit(): void {
    this.companyForm = new UntypedFormGroup({
      name: new UntypedFormControl('',  {validators: [Validators.required]}),
      adminID: new UntypedFormControl('', {validators: [Validators.required]} ),
      segment: new UntypedFormControl(''),
      description: new UntypedFormControl('', {validators: [Validators.required]}),
      isOpen: new UntypedFormControl(false),
      isPublic: new UntypedFormControl(false)
    })
    
    this.userID = this.accountService.getUserID();
    this.user = this.accountService.getUser();

    if(this.user && this.userID){
      this.adminName = this.user.name!;
      this.companyForm.controls['adminID'].setValue(this.userID);
    }
  }

  onSubmit(){
    this.companyService.insert(this.companyForm.value);
    this.router.navigate(["company/list"]);
  }

  onCancel(){
    this.router.navigate(["company/list"]);
  }

}
