import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/account/services/account.service';
import { Company } from 'src/app/shared/models/company.model';
import { UiService } from 'src/app/shared/services/ui.service';
import { CompanyService } from '../services/company.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-edit-company',
  templateUrl: './edit-company.component.html',
  styleUrls: ['./edit-company.component.css']
})
export class EditCompanyComponent implements OnInit {
  isLoading = false;
  private loadingSub!: Subscription;
  private companySub: Subscription | undefined;
  private userSub: Subscription | undefined;
  companyId!: string | null;
  company: Company | undefined;
  administrators: UntypedFormControl[] = [];//  = new UntypedFormControl('');

  companyForm: FormGroup = new UntypedFormGroup({
    name: new UntypedFormControl('', { validators: [Validators.required] }),
    segment: new UntypedFormControl(''),
    description: new UntypedFormControl(''),
    isOpen: new UntypedFormControl(false),
    isPublic: new UntypedFormControl(false),
  })

  constructor(
    private companyService: CompanyService,
    private accountService: AccountService,
    private uiService: UiService,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.loadingSub = this.uiService.loadingStateChanged
      .subscribe(isLoading => this.isLoading = isLoading);

    let idPayload: any = this.location.getState();
    if (idPayload.id) {
      this.fetchCompany(idPayload.id);
    }
  }


  private fetchCompany(id: string) {
    this.companySub = this.companyService.fetchCompanyDoc(id)
      .subscribe((payload: Company) => {
        if (payload) {
          this.company = payload;
          this.companyForm.setValue({
            name: payload.name,
            segment: payload.segment,
            description: payload.description,
            isOpen: payload.isOpen,
            isPublic: payload.isPublic,
          });
          this.fetchAdmin(payload.administrators!);
        }
      });
  }


  private fetchAdmin(uids: string[]) {
    this.userSub = this.accountService.fetchUserDocList(uids)
      .subscribe(data => {
        this.administrators = data
          .map( usr => new UntypedFormControl(`${usr.name} (${usr.email})`));
      })
  }


  ngOnDestroy(): void {
    this.loadingSub.unsubscribe();
    if (this.companySub) {
      this.companySub.unsubscribe();
    }
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }


  onSubmit() {
    this.companyService.update(this.company?.id!, { ...this.companyForm.value });
    this.router.navigate(["company/welcome"]);
  }


  onCancelOrExit() {
    this.router.navigate(["company/welcome"]);
  }

}
