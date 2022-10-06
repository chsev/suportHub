import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
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
  private userDataChangedSub: Subscription | undefined;
  adminName: string = '';
  administrator = new UntypedFormControl('');

  constructor(
    private router: Router,
    private companyService: CompanyService,
    private accountService: AccountService,
  ) { }

  ngOnInit(): void {
    this.companyForm = new UntypedFormGroup({
      name: new UntypedFormControl('',  {validators: [Validators.required]}),
      segment: new UntypedFormControl(''),
      description: new UntypedFormControl('', {validators: [Validators.required]}),
      isOpen: new UntypedFormControl(false),
      isPublic: new UntypedFormControl(false)
    })
    
    this.userDataChangedSub = this.accountService.userDataChanged
      .subscribe( (userData: User) => {
        this.user = userData;
        this.administrator.setValue(`${this.user.name} (${this.user.email})`)
      })
    this.accountService.fetchUserData();
  }


  ngOnDestroy(): void {
    this.userDataChangedSub?.unsubscribe();
  }


  async onSubmit(){
    if(this.user){
      let newCompanyid = await this.companyService.insert({...this.companyForm.value, administrators: [this.user.id]});
      if(newCompanyid){
        this.accountService.updateUserCompany(newCompanyid, this.user.id!);
      } 
      this.router.navigate(["company/welcome"]);
    }
  }


  onCancel(){
    this.router.navigate(["company/welcome"]);
  }

}
