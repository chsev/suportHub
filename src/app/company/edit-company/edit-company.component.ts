import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Company } from 'src/app/shared/models/company.model';
import { CompanyService } from '../services/company.service';

@Component({
  selector: 'app-edit-company',
  templateUrl: './edit-company.component.html',
  styleUrls: ['./edit-company.component.css']
})
export class EditCompanyComponent implements OnInit {
  companyId!: string | null;
  company!: any;
  companyForm: UntypedFormGroup = new UntypedFormGroup({
    name: new UntypedFormControl('', { validators: [Validators.required] }),
    administrator: new UntypedFormControl('', { validators: [Validators.required] }),
    segment: new UntypedFormControl(''),
    description: new UntypedFormControl(''),
    isOpen: new UntypedFormControl(false)
  })

  constructor(
    private companyService: CompanyService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.companyId = this.companyService.editingCompanyId;

    if (!this.companyId) {
      this.onCancelOrExit();
    } else {
      this.companyService.editingCompanyChanged
        .subscribe(payload => {
          this.company = payload as Company;
          this.companyForm.setValue({
            name: payload.name,
            administrator: payload.administrator,
            segment: payload.segment,
            description: payload.description,
            isOpen: payload.isOpen
          })
        }
        );
      this.companyService.searchById(this.companyId)
    }
  }


  onSubmit() {
    this.companyService.update({ id: this.companyId, ...this.companyForm.value });
    this.router.navigate(["company/welcome"]);
  }


  onCancelOrExit() {
    this.router.navigate(["company/welcome"]);
  }


}
