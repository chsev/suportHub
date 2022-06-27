import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/account/services/account.service';
import { Company } from 'src/app/shared/models/company.model';
import { UiService } from 'src/app/shared/services/ui.service';
import { CompanyService } from '../services/company.service';


export interface EditingPayload {
  id: string
}


@Component({
  selector: 'app-edit-company',
  templateUrl: './edit-company.component.html',
  styleUrls: ['./edit-company.component.css']
})
export class EditCompanyComponent implements OnInit {
  isLoading = false;
  private loadingSub!: Subscription;
  private queryParams!: Subscription;
  private companySub: Subscription | undefined;
  private userSub: Subscription | undefined;
  companyId!: string | null;
  company: Company | undefined;
  administrator = new UntypedFormControl('');


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
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // this.companyId = this.companyService.editingCompanyId;
    this.loadingSub = this.uiService.loadingStateChanged
      .subscribe(isLoading => this.isLoading = isLoading);

    this.queryParams = this.route.queryParams.subscribe(params => {
      console.log(params);
      // this.companyId = params.id;
      this.fetchCompany(params.id);
      // this.companyService.searchById(this.companyId)

    });

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

          this.fetchAdmin(payload.administrator!);
        }
      }
      );
  }

  private fetchAdmin(uid: string) {
    this.userSub = this.accountService.fetchUserDoc(uid)
      .subscribe( data => this.administrator.setValue(`${data.name} (${data.email})`)
      )
  }


  ngOnDestroy(): void {
    this.loadingSub.unsubscribe();
    this.queryParams.unsubscribe();
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
